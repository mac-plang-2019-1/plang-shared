'use strict';

function elem(tag, cssClass, ...children) {
  return $('<' + tag + '>', { class: cssClass })
    .append(children);
}


class GrammarNode {
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
  constructor(text) {
    super();
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
  constructor(children) {
    super();
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
  constructor(name, choices, cssClass, replaceTreeNode) {
    super();
    this.name = name;
    this.choices = choices.map((choice) => { return new Sequence(choice) });
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
    chooser.append(choices)

    header.click(() => { choices.toggle() });

    return chooser;
  }

  renderSummary() {
    return elem("div", this.cssClass, this.name);
  }
}

class Repetition extends GrammarNode {
  constructor(child) {
    super();
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
  render() {
    return $([]);
  }

  renderSummary() {
    return elem("div", "nothing", "< nothing >");
  }
}

class TextInput extends GrammarNode {
  constructor(caption) {
    super();
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
    "optional nonterminal",
    true);
}

function multiple(...items) {
  let repetition = new Repetition();
  let choice = new Choice(
    textSummary(items),
    [
      items.concat(repetition),
      [new Nothing()]
    ],
    "multiple nonterminal",
    true);
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
