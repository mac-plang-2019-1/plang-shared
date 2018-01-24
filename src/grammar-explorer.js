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
    elem.data('tree-node', this.createTreeNode());
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
    return elem("div", "literal", this.text);
  }

  renderSummary() {
    return this.render();
  }
}


class Sequence extends GrammarNode {
  constructor(grammar, children) {
    super(grammar);
    this.children = children;
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
    return this.resolvedChildren.map((child) => {
      return child.renderWithTreeNode();
    });
  }

  renderSummary() {
    return elem("div", "substitution",
      ...this.resolvedChildren.map((child) => { return child.renderSummary() }));
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
    this.choices = choices.map((choice) => { return new Sequence(this.grammar, choice) });
    this.cssClass = cssClass;
    this.replaceTreeNode = replaceTreeNode;
  }

  render() {
    let header = elem("a", this.cssClass, this.name);
    let chooser = elem("div", "chooser",
      elem("div", "header", header));

    let choices = elem("div", "choices",
      ...this.choices.map((choice) => {
        return choice.renderSummary()
          .click(() => {
            let treeParent = GrammarNode.treeNodeFor($(chooser));
            let replacement = choice.render();

            $(chooser).replaceWith(replacement);

            let newTreeNodeContainer
            if(this.replaceTreeNode) {
              newTreeNodeContainer = elem("div")
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

    header.click(() => { choices.toggle() });

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
    return elem("div", "nothing", "< nothing >");
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
    return elem("div", "text-input", elem("div", "caption", this.caption));
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

  _textSummary(items) {
    return items.map((item) => {
      return item.renderSummary ? item.renderSummary().text() : item;
    }).join(" ");
  }

  textInput() {
    return new TextInput(this, ...arguments);
  }

  findSymbol(symbolName) {
    let result = this.productions[symbolName];
    if(Array.isArray(result)) {
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

// –––––– Generator ––––––

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

  let randomElem = function(elems) {
    return elems[Math.floor(Math.random() * elems.length)];
  }

  let generationDelay = 1000;
  let applyRandomProduction = function() {
    if(!randomGenerationInProgress)
      return;  // user stopped it

    let target = randomElem($('.chooser'));
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
