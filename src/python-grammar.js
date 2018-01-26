'use strict';
(() => {

let g = new Grammar({
  name: "Python",
  docLinks: [
    {
      name: "Language reference",
      url: "https://docs.python.org/3.6/reference/index.html"
    }
  ],
  startSymbols: [
    'keywords_arguments',
    'file_input',
    'interactive_input',
    'statement',
    'expression'
  ]
});

addGrammar(g);

g.productions = {
  compound_stmt: [
    ["if_stmt"],
    ["while_stmt"],
    ["for_stmt"],
    ["try_stmt"],
    ["with_stmt"],
    ["funcdef"],
    ["classdef"],
    ["async_with_stmt"],
    ["async_for_stmt"],
    ["async_funcdef"]
  ],
  suite: [
    ["stmt_list", g.literal("NEWLINE")],
    [g.literal("NEWLINE"), g.literal("INDENT"), "statement", g.multiple("statement"), g.literal("DEDENT")]
  ],
  statement: [
    ["stmt_list", g.literal("NEWLINE")],
    ["compound_stmt"]
  ],
  stmt_list: [
    ["simple_stmt", g.multiple(g.literal(";"), "simple_stmt"), g.optional(g.literal(";"))]
  ],

  if_stmt: [
    [g.literal("if"), "expression", g.literal(":"), "suite", g.multiple(g.literal("elif"), "expression", g.literal(":"), "suite"), g.optional(g.literal("else"), g.literal(":"), "suite")]
  ],

  while_stmt: [
    [g.literal("while"), "expression", g.literal(":"), "suite", g.optional(g.literal("else"), g.literal(":"), "suite")]
  ],

  for_stmt: [
    [g.literal("for"), "target_list", g.literal("in"), "expression_list", g.literal(":"), "suite", g.optional(g.literal("else"), g.literal(":"), "suite")]
  ],

  try_stmt: [
    ["try1_stmt"],
    ["try2_stmt"]
  ],
  try1_stmt: [
    [g.literal("try"), g.literal(":"), "suite", g.literal("except"), g.optional("expression", g.optional(g.literal("as"), "identifier")), g.literal(":"), "suite", g.multiple(g.literal("except"), g.optional("expression", g.optional(g.literal("as"), "identifier")), g.literal(":"), "suite"), g.optional(g.literal("else"), g.literal(":"), "suite"), g.optional(g.literal("finally"), g.literal(":"), "suite")]
  ],
  try2_stmt: [
    [g.literal("try"), g.literal(":"), "suite", g.literal("finally"), g.literal(":"), "suite"]
  ],

  with_stmt: [
    [g.literal("with"), "with_item", g.multiple(g.literal(","), "with_item"), g.literal(":"), "suite"]
  ],
  with_item: [
    ["expression", g.optional(g.literal("as"), "target")]
  ],

  funcdef: [
    [g.optional("decorators"), g.literal("def"), "funcname", g.literal("("), g.optional("parameter_list"), g.literal(")"), g.optional(g.literal("->"), "expression"), g.literal(":"), "suite"]
  ],
  decorators: [
    ["decorator", g.multiple("decorator")]
  ],
  decorator: [
    [g.literal("@"), "dotted_name", g.optional(g.literal("("), g.optional("argument_list", g.optional(g.literal(","))), g.literal(")")), g.literal("NEWLINE")]
  ],
  dotted_name: [
    ["identifier", g.multiple(g.literal("."), "identifier")]
  ],
  parameter_list: [
    ["defparameter", g.multiple(g.literal(","), "defparameter"), g.optional(g.literal(","), g.optional("parameter_list_starargs"))],
    ["parameter_list_starargs"]
  ],
  parameter_list_starargs: [
    [g.literal("*"), g.optional("parameter"), g.multiple(g.literal(","), "defparameter"), g.optional(g.literal(","), g.optional(g.literal("**"), "parameter", g.optional(g.literal(","))))],
    [g.literal("**"), "parameter", g.optional(g.literal(","))]
  ],
  parameter: [
    ["identifier", g.optional(g.literal(":"), "expression")]
  ],
  defparameter: [
    ["parameter", g.optional(g.literal("="), "expression")]
  ],
  funcname: [
    ["identifier"]
  ],

  classdef: [
    [g.optional("decorators"), g.literal("class"), "classname", g.optional("inheritance"), g.literal(":"), "suite"]
  ],
  inheritance: [
    [g.literal("("), g.optional("argument_list"), g.literal(")")]
  ],
  classname: [
    ["identifier"]
  ],

  async_funcdef: [
    [g.optional("decorators"), g.literal("async"), g.literal("def"), "funcname", g.literal("("), g.optional("parameter_list"), g.literal(")"), g.optional(g.literal("->"), "expression"), g.literal(":"), "suite"]
  ],

  async_for_stmt: [
    [g.literal("async"), "for_stmt"]
  ],

  async_with_stmt: [
    [g.literal("async"), "with_stmt"]
  ],

  atom: [
    ["identifier"],
    ["literal"],
    ["enclosure"]
  ],
  enclosure: [
    ["parenth_form"],
    ["list_display"],
    ["dict_display"],
    ["set_display"],
    ["generator_expression"],
    ["yield_atom"]
  ],

  literal: [
    ["stringliteral"],
    ["bytesliteral"],
    ["integer"],
    ["floatnumber"],
    ["imagnumber"]
  ],

  parenth_form: [
    [g.literal("("), g.optional("starred_expression"), g.literal(")")]
  ],

  comprehension: [
    ["expression", "comp_for"]
  ],
  comp_for: [
    [g.optional(g.literal("ASYNC")), g.literal("for"), "target_list", g.literal("in"), "or_test", g.optional("comp_iter")]
  ],
  comp_iter: [
    ["comp_for"],
    ["comp_if"]
  ],
  comp_if: [
    [g.literal("if"), "expression_nocond", g.optional("comp_iter")]
  ],

  list_display: [
    [g.literal("["), g.choice(g.optional("starred_list"), g.optional("comprehension")), g.literal("]")]
  ],

  set_display: [
    [g.literal("{"), g.choice(g.optional("starred_list"), g.optional("comprehension")), g.literal("}")]
  ],

  dict_display: [
    [g.literal("{"), ["key_datum_list"],
    ["dict_comprehension"], g.literal("}")]
  ],
  key_datum_list: [
    ["key_datum", g.multiple(g.literal(","), "key_datum"), g.optional(g.literal(","))]
  ],
  key_datum: [
    ["expression", g.literal(":"), "expression"],
    [g.literal("**"), "or_expr"]
  ],
  dict_comprehension: [
    ["expression", g.literal(":"), "expression", "comp_for"]
  ],

  generator_expression: [
    [g.literal("("), "expression", "comp_for", g.literal(")")]
  ],

  yield_atom: [
    [g.literal("("), "yield_expression", g.literal(")")]
  ],
  yield_expression: [
    [g.literal("yield"), ["expression_list"],
    [g.literal("from"), "expression"]]
  ],

  primary: [
    ["atom"],
    ["attributeref"],
    ["subscription"],
    ["slicing"],
    ["call"]
  ],

  attributeref: [
    ["primary", g.literal("."), "identifier"]
  ],

  subscription: [
    ["primary", g.literal("g.optional("), "expression_list", g.literal(")")]
  ],

  slicing: [
    ["primary", g.literal("g.optional("), "slice_list", g.literal(")")]
  ],
  slice_list: [
    ["slice_item", g.multiple(g.literal(","), "slice_item"), g.optional(g.literal(","))]
  ],
  slice_item: [
    ["expression"],
    ["proper_slice"]
  ],
  proper_slice: [
    [g.optional("lower_bound"), g.literal(":"), g.optional("upper_bound"), g.optional(g.literal(":"), g.optional("stride"), )]
  ],
  lower_bound: [
    ["expression"]
  ],
  upper_bound: [
    ["expression"]
  ],
  stride: [
    ["expression"]
  ],

  call: [
    ["primary", g.literal("("), ["argument_list", g.optional(g.literal(","))],
    ["comprehension"], g.literal(")")]
  ],
  argument_list: [
    ["positional_arguments", g.optional(g.literal(","), "starred_and_keywords"), g.optional(g.literal(","), "keywords_arguments"), "starred_and_keywords", g.optional(g.literal(","), "keywords_arguments")],
    ["keywords_arguments"]
  ],
  positional_arguments: [
    [g.optional(g.literal("*")), "expression", g.multiple(g.literal(","), g.optional(g.literal("*")), "expression")]
  ],
  starred_and_keywords: [
    [g.choice(g.optional(g.literal("*"), "expression"), g.optional("keyword_item"))],
    [g.multiple(g.choice(g.optional(g.literal(","), g.literal("*"), "expression"), g.optional(g.literal(","), "keyword_item")))]
  ],
  keywords_arguments: [
    [g.choice(g.optional("keyword_item"), g.optional(g.literal("**"), "expression")),
      g.multiple(g.choice(g.optional(g.literal(","), "keyword_item"), g.optional(g.literal(","), g.literal("**"), "expression")))]
  ],
  keyword_item: [
    ["identifier", g.literal("="), "expression"]
  ],

  await_expr: [
    [g.literal("await"), "primary"]
  ],

  power: [
    [g.choice(g.optional("await_expr"), g.optional("primary", )), g.optional(g.literal("**"), "u_expr")]
  ],

  u_expr: [
    ["power"],
    [g.literal("-"), "u_expr"],
    [g.literal("+"), "u_expr"],
    [g.literal("~"), "u_expr"]
  ],

  m_expr: [
    ["u_expr"],
    ["m_expr", g.literal("*"), "u_expr"],
    ["m_expr", g.literal("@"), "m_expr"],
    ["m_expr", g.literal("//"), "u_expr"],
    ["m_expr", g.literal("/"), "u_expr"],
    ["m_expr", g.literal("%"), "u_expr"]
  ],
  a_expr: [
    ["m_expr"],
    ["a_expr", g.literal("+"), "m_expr"],
    ["a_expr", g.literal("-"), "m_expr"]
  ],

  shift_expr: [
    ["a_expr"],
    ["shift_expr", g.choice(g.optional(g.literal("<<")), g.optional(g.literal(">>"), )), "a_expr"]
  ],

  and_expr: [
    ["shift_expr"],
    ["and_expr", g.literal("&"), "shift_expr"]
  ],
  xor_expr: [
    ["and_expr"],
    ["xor_expr", g.literal("^"), "and_expr"]
  ],
  or_expr: [
    ["xor_expr"],
    ["or_expr", g.literal("|"), "xor_expr"]
  ],

  comparison: [
    ["or_expr", g.multiple("comp_operator", "or_expr")]
  ],
  comp_operator: [
    [g.literal("<")],
    [g.literal(">")],
    [g.literal("==")],
    [g.literal(">=")],
    [g.literal("<=")],
    [g.literal("!=")],
    [g.literal("is"), g.optional(g.literal("not"))],
    [g.optional(g.literal("not")), g.literal("in")]
  ],

  or_test: [
    ["and_test"],
    ["or_test", g.literal("or"), "and_test"]
  ],
  and_test: [
    ["not_test"],
    ["and_test", g.literal("and"), "not_test"]
  ],
  not_test: [
    ["comparison"],
    [g.literal("not"), "not_test"]
  ],

  conditional_expression: [
    ["or_test", g.optional(g.literal("if"), "or_test", g.literal("else"), "expression")]
  ],
  expression: [
    ["conditional_expression"],
    ["lambda_expr"]
  ],
  expression_nocond: [
    ["or_test"],
    ["lambda_expr_nocond"]
  ],

  lambda_expr: [
    [g.literal("lambda"), g.optional("parameter_list"), g.literal(":"), "expression"]
  ],
  lambda_expr_nocond: [
    [g.literal("lambda"), g.optional("parameter_list"), g.literal(":"), "expression_nocond"]
  ],

  expression_list: [
    ["expression", g.multiple(g.literal(","), "expression"), g.optional(g.literal(","))]
  ],
  starred_list: [
    ["starred_item", g.multiple(g.literal(","), "starred_item"), g.optional(g.literal(","))]
  ],
  starred_expression: [
    ["expression"],
    [g.multiple("starred_item", g.literal(",")), g.optional("starred_item")]
  ],
  starred_item: [
    ["expression"],
    [g.literal("*"), "or_expr"]
  ],

  simple_stmt: [
    ["expression_stmt"],
    ["assert_stmt"],
    ["assignment_stmt"],
    ["augmented_assignment_stmt"],
    ["annotated_assignment_stmt"],
    ["pass_stmt"],
    ["del_stmt"],
    ["return_stmt"],
    ["yield_stmt"],
    ["raise_stmt"],
    ["break_stmt"],
    ["continue_stmt"],
    ["import_stmt"],
    ["global_stmt"],
    ["nonlocal_stmt"]
  ],

  expression_stmt: [
    ["starred_expression"]
  ],

  assignment_stmt: [
    ["target_list", g.literal("="), g.multiple("target_list", g.literal("=")), g.choice(g.optional("starred_expression"), g.optional("yield_expression"))]
  ],
  target_list: [
    ["target", g.multiple(g.literal(","), "target"), g.optional(g.literal(","))]
  ],
  target: [
    ["identifier"],
    [g.literal("("), g.optional("target_list"), g.literal(")")],
    [g.literal("g.optional("), g.optional("target_list"), g.literal(")")],
    ["attributeref"],
    ["subscription"],
    ["slicing"],
    [g.literal("*"), "target"]
  ],

  augmented_assignment_stmt: [
    ["augtarget", "augop", g.choice(g.optional("expression_list"), g.optional("yield_expression"))]
  ],
  augtarget: [
    ["identifier"],
    ["attributeref"],
    ["subscription"],
    ["slicing"]
  ],
  augop: [
    [g.literal("+=")],
    [g.literal("-=")],
    [g.literal("*=")],
    [g.literal("@=")],
    [g.literal("/=")],
    [g.literal("//=")],
    [g.literal("%=")],
    [g.literal("**=")],
    [g.literal(">>=")],
    [g.literal("<<=")],
    [g.literal("&=")],
    [g.literal("^=")],
    [g.literal("|=")]
  ],

  annotated_assignment_stmt: [
    ["augtarget", g.literal(":"), "expression", g.optional(g.literal("="), "expression")]
  ],

  assert_stmt: [
    [g.literal("assert"), "expression", g.optional(g.literal(","), "expression")]
  ],

  pass_stmt: [
    [g.literal("pass")]
  ],

  del_stmt: [
    [g.literal("del"), "target_list"]
  ],

  return_stmt: [
    [g.literal("return"), g.optional("expression_list")]
  ],

  yield_stmt: [
    ["yield_expression"]
  ],

  raise_stmt: [
    [g.literal("raise"), g.optional("expression", g.optional(g.literal("from"), "expression"))]
  ],

  break_stmt: [
    [g.literal("break")]
  ],

  continue_stmt: [
    [g.literal("continue")]
  ],

  import_stmt: [
    [g.literal("import"), "module", g.optional(g.literal("as"), "name"), g.multiple(g.literal(","), "module", g.optional(g.literal("as"), "name"))],
    [g.literal("from"), "relative_module", g.literal("import"),
      "identifier", g.optional(g.literal("as"), "name"),
      g.multiple(g.literal(","), "identifier", g.optional(g.literal("as"), "name"))],
    [g.literal("from"), "relative_module", g.literal("import"),
      g.literal("("), "identifier", g.optional(g.literal("as"), "name"),
      g.multiple(g.literal(","), "identifier", g.optional(g.literal("as"), "name")),
      g.optional(g.literal(",")), g.literal(")")],
    [g.literal("from"), "module", g.literal("import"), g.literal("*")]
  ],
  module: [
    [g.multiple("identifier", g.literal(".")), "identifier"]
  ],
  relative_module: [
    [g.optional(g.literal(".")), "module"],
    [g.literal("."), g.multiple(g.literal("."))]
  ],
  name: [
    ["identifier"]
  ],

  global_stmt: [
    [g.literal("global"), "identifier", g.multiple(g.literal(","), "identifier")]
  ],

  nonlocal_stmt: [
    [g.literal("nonlocal"), "identifier", g.multiple(g.literal(","), "identifier")]
  ],

  file_input: [
    [g.multiple(g.choice(g.optional(g.literal("NEWLINE")), g.optional("statement")))]
  ],

  interactive_input: [
    [g.optional("stmt_list"), g.literal("NEWLINE")],
    ["compound_stmt", g.literal("NEWLINE")]
  ],

  eval_input: [
    ["expression_list", g.multiple(g.literal("NEWLINE"))]
  ],

  future_statement: [
    [g.literal("from"), g.literal("__future__"), g.literal("import"), "feature", g.optional(g.literal("as"), name), g.multiple(g.literal(","), "feature", g.optional(g.literal("as"), name)), g.literal("from"), g.literal("__future__"), g.literal("import"), g.literal("g.multiple("), "feature", g.optional(g.literal("as"), name), (g.literal(","), "feature", g.optional(g.literal("as"), name)), g.optional(g.literal(",")), g.literal(")")]
  ],
  feature: [
    ["identifier"]
  ],
  name: [
    ["identifier"]
  ],

  identifier:    [g.textInput("identifier")],
  stringliteral: [g.textInput("stringliteral")],
  bytesliteral:  [g.textInput("bytesliteral")],
  integer:       [g.textInput("integer")],
  floatnumber:   [g.textInput("floatnumber")],
  imagnumber:    [g.textInput("imagnumber")],
};

})();
