'use strict';

function elem(tag, cssClass, ...children) {
  return $('<' + tag + '>', { class: cssClass })
    .append(children);
}

class Literal {
  constructor(text) {
    this.text = text;
  }

  render() {
    return elem("div", "literal", this.text);
  }

  renderSummary() {
    return this.render();
  }
}

class Substitution {
  constructor(children) {
    this.children = children;
  }

  get resolvedChildren() {
    return this.children.map((child) => {
      if(typeof child == "string")
        return findSymbol(child);
      else
        return child;
    });
  }

  render() {
    return this.resolvedChildren.map((child) => { return child.render() });
  }

  renderSummary() {
    return elem("div", "substitution",
      ...this.resolvedChildren.map((child) => { return child.renderSummary() }));
  }
}

class Choice {
  constructor(name, choices, cssClass) {
    this.name = name;
    this.choices = choices.map((choice) => { return new Substitution(choice) });
    this.cssClass = cssClass;
  }

  render() {
    let header = elem("a", this.cssClass, this.name);
    let chooser = elem("div", "chooser",
      elem("div", "header", header));

    let choices = elem("div", "choices",
      ...this.choices.map((choice) => {
        return choice.renderSummary()
          .click(() => {
            let replacement = choice.render();
            $(chooser).replaceWith(replacement);

            let treeChildren = findTreeNodeFor(chooser).children('.children');
            for(let newChild of replacement) {
              treeChildren.append(
                createTreeNodeFor(newChild));
            }
          });
      }));
    chooser.append(choices)

    header.click(() => { choices.toggle() });

    return chooser;
  }

  renderSummary() {
    return elem("div", this.cssClass, this.name);
  }
}

class Repetition {
  constructor(child) {
    this.child = child;
  }

  render() {
    return this.child.render();
  }

  renderSummary() {
    return this.child.renderSummary();
  }
}

class Nothing {
  render() {
    return [];
  }

  renderSummary() {
    return elem("div", "nothing", "< nothing >");
  }
}

class TextInput {
  constructor(caption) {
    this.caption = caption;
  }

  render() {
    return this.renderSummary().prepend(
      $('<input type="text">'));
  }

  renderSummary() {
    return elem("div", "text-input", elem("div", "caption", this.caption));
  }
}

function textSummary(items) {
  return items.map((item) => {
    return item.renderSummary ? item.renderSummary().text() : item;
  }).join(" ");
}

function literal(text) {
  return new Literal(text);
}

function optional(...items) {
  return new Choice(
    textSummary(items),
    [
      items,
      [new Nothing()]
    ],
    "optional nonterminal");
}

function multiple(...items) {
  let repetition = new Repetition();
  let choice = new Choice(
    textSummary(items),
    [
      items.concat(repetition),
      [new Nothing()]
    ],
    "multiple nonterminal");
  repetition.child = choice;
  return choice;
}

function textInput() {
  return new TextInput(...arguments);
}




let grammar = { };

function findSymbol(symbolName) {
  let result = grammar[symbolName];
  if(Array.isArray(result)) {
    result = new Choice(symbolName, result, "nonterminal");
    grammar[symbolName] = result;
  }
  return result;
}



var treeNodeId = 0;

function createTreeNodeFor(grammarElem) {
  let text = $(grammarElem).find('.header').text() || $(grammarElem).text();

  let treeNode = elem("div", "tree-node",
    elem("div", "label", text),
    elem("div", "children"));
  $(grammarElem).attr('tree-node-id', treeNodeId);
  $(treeNode).attr('id', 'tree-node-' + treeNodeId);

  treeNodeId++;

  return treeNode;
}

function findTreeNodeFor(grammarElem) {
  return $('#tree-node-' + $(grammarElem).attr('tree-node-id'));
}
