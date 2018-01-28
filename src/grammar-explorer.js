'use strict';

function elem(tag, cssClass, ...children) {
  return $('<' + tag + '>', { class: cssClass })
    .append(children);
}

// –––––– Grammar nodes ––––––

class GrammarNode {
  constructor(grammar) {
    if(!grammar)
      throw "No grammar provided";
    this.grammar = grammar;
  }

  createTreeNode() {
    return elem("div", "tree-node",
      this.renderSummary(),
      elem("div", "children"));
  }

  renderWithTreeNode() {
    let elem = this.render();
    let treeNode = this.createTreeNode();
    elem.data('tree-node', treeNode);

    let activateHighlight = (active) => {
      $('.workspace-content').toggleClass('tree-hover-active', active);
      elem.toggleClass('tree-hover', active);
      elem.next('.replacement').toggleClass('tree-hover', active);
    };

    treeNode.find('.nonterminal')
      .hover(
        () => activateHighlight(true),
        () => activateHighlight(false))
      .click(
        () => {
          elem.show();
          elem.next('.replacement').remove();
          treeNode.find('.children').children().remove();
        });

    return elem;
  }

  static treeNodeFor(elem) {
    return elem.data('tree-node');
  }
}


class Literal extends GrammarNode {
  constructor(grammar, text) {
    super(grammar);
    this.text = text;
  }

  render() {
    return elem("div", "symbol literal", this.text);
  }

  renderSummary() {
    return this.render();
  }
}


class Sequence extends GrammarNode {
  constructor(grammar, children) {
    super(grammar);
    this.children = Array.isArray(children) ? children : [children];
  }

  get resolvedChildren() {
    return this.children.map((child) => {
      if(typeof child == "string")
        return this.grammar.findSymbol(child);
      else
        return child;
    });
  }

  render() {
    return this.resolvedChildren.map((child) => child.renderWithTreeNode());
  }

  renderSummary() {
    return elem("div", "symbol substitution",
      ...this.resolvedChildren.map((child) => child.renderSummary()));
  }

  insertTreeNodes(treeParent) {
    let childContainer = treeParent.children('.children');
    for(let child of this.resolvedChildren) {
      childContainer.append(
        child.createTreeNode());
    }
  }
}


class Choice extends GrammarNode {
  constructor({ grammar, name, choices, cssClass, replaceTreeNode = false }) {
    super(grammar);
    this.name = name;
    this.choices = choices.map((choice) => new Sequence(this.grammar, choice));
    this.cssClass = cssClass;
    this.replaceTreeNode = replaceTreeNode;
  }

  render() {
    let header = elem("a", this.cssClass, this.name);
    let chooser = elem("div", "symbol chooser",
      elem("div", "header", header));

    let choices = elem("div", "choices",
      ...this.choices.map((choice) => {
        return choice.renderSummary()
          .click(() => {
            let treeParent = GrammarNode.treeNodeFor($(chooser));
            let replacement = choice.render();
            let replacementContainer = elem('span', 'replacement', ...replacement);

            replacementContainer.insertAfter(chooser);
            chooser.hide();

            let newTreeNodeContainer;
            if(this.replaceTreeNode) {
              newTreeNodeContainer = elem("div");
              treeParent.replaceWith(newTreeNodeContainer);
            } else {
              newTreeNodeContainer = treeParent.children('.children');
            }

            for(let newChild of replacement) {
              let childTreeNode = GrammarNode.treeNodeFor(newChild);
              if(childTreeNode)
                newTreeNodeContainer.append(childTreeNode);
            }
          });
      }));
    chooser.append(
      elem("div", "choicescontainer",
        choices))

    header.click(() => {
      choices.toggle();
      $('.choices').not(choices).hide();
    });

    return chooser;
  }

  renderSummary() {
    return elem("div", this.cssClass, this.name);
  }
}


class Repetition extends GrammarNode {
  constructor(grammar, child) {
    super(grammar);
    this.child = child;
  }

  render() {
    return this.child.render();
  }

  renderSummary() {
    return this.child.renderSummary();
  }
}


class Nothing extends GrammarNode {
  constructor(grammar) {
    super(grammar);
  }

  render() {
    return $([]);
  }

  renderSummary() {
    return elem("div", "symbol nothing", "< nothing >");
  }
}


class TextInput extends GrammarNode {
  constructor(grammar, caption) {
    super(grammar);
    this.caption = caption;
  }

  render() {
    return this.renderSummary().prepend(
      $('<input class="value" type="text">'));
  }

  renderSummary() {
    return elem("div", "symbol text-input", elem("div", "caption", this.caption));
  }

  createTreeNode() {
    return elem("div", "tree-node",
      elem("div", "text-input",
        elem("div", "value", "…")));
  }

  renderWithTreeNode() {
    let elem = super.renderWithTreeNode();

    let updateText = (e) => {
      GrammarNode.treeNodeFor($(elem))
        .find('.value')
        .text($(e.target).val());
    };
    $(elem).find('input')
      .change(updateText)
      .keyup(updateText);

    return elem;
  }
}

// –––––– Grammar ––––––

class Grammar {
  constructor({ name, startSymbols, docLinks }) {
    this.name = name;
    this.startSymbols = startSymbols;
    this.docLinks = docLinks;
  }

  literal(text) {
    return new Literal(this, text);
  }

  optional(...items) {
    return new Choice({
      grammar: this,
      name: this._textSummary(items),
      choices: [
        items,
        [new Nothing(this)]
      ],
      cssClass: "optional nonterminal",
      replaceTreeNode: true
    });
  }

  multiple(...items) {
    let repetition = new Repetition(this);
    let choice = new Choice({
      grammar: this,
      name: this._textSummary(items),
      choices: [
        items.concat(repetition),
        [new Nothing(this)]
      ],
      cssClass: "multiple nonterminal",
      replaceTreeNode: true
    });
    repetition.child = choice;
    return choice;
  }

  choice(...choices) {  // essentially an anonymous symbol
    let choice = new Choice({
      grammar: this,
      name: "(" + this._textSummary(choices, " | ") + ")",
      choices: choices.map((x) => [x]),
      cssClass: "nonterminal",
      replaceTreeNode: true
    });
    return choice;
  }

  _textSummary(items, separator = " ") {
    return items
      .map((item) => item.renderSummary ? item.renderSummary().text() : item)
      .join(separator);
  }

  textInput() {
    return new TextInput(this, ...arguments);
  }

  findSymbol(symbolName) {
    let result = this.productions[symbolName];

    if(!result)
      throw "Symbol not found: " + symbolName;

    if(Array.isArray(result)) {  // lazy resolution allows recursive symbols
      result = new Choice({
        grammar: this, name: symbolName, choices: result, cssClass: "nonterminal"
      });
      this.productions[symbolName] = result;
    }
    return result;
  }

  show() {
    document.title = "Grammar Explorer: " + this.name;

    $('.grammar-title').text(document.title);
    $('.doc-links').empty().append(
      this.docLinks.map((link) =>
        elem("a", "doc-link", link.name).attr('href', link.url)
      )
    );

    let startChooser = new Choice({
      grammar: this,
      name: "Choose starting symbol",
      choices: this.startSymbols.map((sym) => [sym]),
      cssClass: "nonterminal",
      replaceTreeNode: true
    });

    let startElem = startChooser.renderWithTreeNode().addClass("start");
    $('.workspace-content').empty().append(startElem);

    let treeNode = GrammarNode.treeNodeFor(startElem);
    treeNode.hide();  // Not a real grammar symbol (yet)
    $('.tree-content').empty().append(treeNode);
  }
}

let grammars = [];

function addGrammar(grammar) {
  grammars.push(grammar);  
}

// –––––– Random generation ––––––

let randomGenerationInProgress = false;

function toggleRandomGeneration() {
  if(randomGenerationInProgress)
    stopRandomGeneration();
  else
    startRandomGeneration();
}

function startRandomGeneration() {
  randomGenerationInProgress = true;

  $('.generate').addClass('in-progress');

  let randomElem = function(elems, curve = 1) {
    return elems[
      Math.floor(
        Math.pow(Math.random(), curve)
         * elems.length)];
  }

  let generationDelay = 1.000;
  let applyRandomProduction = function() {
    if(!randomGenerationInProgress)
      return;  // user stopped it

    let choosers = $('.chooser:visible');
    let target = randomElem(
      choosers,
      (100.0 + choosers.length) / 100.0);  // increasingly choose the first rule, which tends to terminate sooner
    if(!target){
      stopRandomGeneration();
      return;  // no substitutions left
    }

    target.click();
    randomElem($(target).find('.choices > *')).click();

    generationDelay *= 0.9;
    setTimeout(applyRandomProduction, generationDelay);
  }

  applyRandomProduction();
}

function stopRandomGeneration() {
  randomGenerationInProgress = false;
  $('.generate').removeClass('in-progress');
}

// –––––– Page setup & event binding ––––––

$(() => {
  grammars[0].show();  // could switch this to a drop-down if we ever have multiple grammars

  $('.generate').click(toggleRandomGeneration);
});
