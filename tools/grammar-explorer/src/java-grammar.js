'use strict';
(() => {

let g = new Grammar({
  name: "Java",
  docLinks: [
    {
      name: "Grammar reference",
      url: "https://docs.oracle.com/javase/specs/jls/se9/html/jls-19.html"
    }
  ],
  startSymbols: [
    'CompilationUnit',
    'Statement',
    'Expression'
  ]
});

addGrammar(g);

g.productions = {
  Identifier: [
     [g.textInput("identifier", "[A-Za-z_][A-Za-z0-9_]+")]
  ],

  IntegerLiteral:       [[g.textInput("integer")]],
  FloatingPointLiteral: [[g.textInput("floating")]],
  BooleanLiteral:       [[g.textInput("boolean")]],
  CharacterLiteral:     [[g.textInput("character")]],
  StringLiteral:        [[g.textInput("string")]],
  NullLiteral:          [[g.literal("null")]],

  Literal: [
     ['IntegerLiteral'],
     ['FloatingPointLiteral'],
     ['BooleanLiteral'],
     ['CharacterLiteral'],
     ['StringLiteral'],
     ['NullLiteral']
  ],
  Type: [
     ['PrimitiveType'],
     ['ReferenceType']
  ],
  PrimitiveType: [
     [g.multiple('Annotation'), 'NumericType'],
     [g.multiple('Annotation'), g.literal('boolean')]
  ],
  NumericType: [
     ['IntegralType'],
     ['FloatingPointType']
  ],
  IntegralType: [
     [g.literal('byte')],
     [g.literal('short')],
     [g.literal('int')],
     [g.literal('long')],
     [g.literal('char')]
  ],
  FloatingPointType: [
     [g.literal('float')],
     [g.literal('double')]
  ],
  ReferenceType: [
     ['ClassOrInterfaceType'],
     ['TypeVariable'],
     ['ArrayType']
  ],
  ClassOrInterfaceType: [
     ['ClassType'],
     ['InterfaceType']
  ],
  ClassType: [
     [g.multiple('Annotation'), 
              'Identifier',
              g.optional('TypeArguments')],
     ['ClassOrInterfaceType', g.literal('.'), 
              g.multiple('Annotation'),
              'Identifier', 
              g.optional('TypeArguments')]
  ],
  InterfaceType: [
     ['ClassType']
  ],
  TypeVariable: [
     [g.multiple('Annotation'), 'Identifier']
  ],
  ArrayType: [
     ['PrimitiveType', 'Dims'],
     ['ClassOrInterfaceType', 'Dims'],
     ['TypeVariable', 'Dims']
  ],
  Dims: [
     [g.multiple('Annotation'), g.literal('['), g.literal(']'), g.multiple(g.multiple('Annotation'), g.literal('['), g.literal(']'))]
  ],
  TypeParameter: [
     [g.multiple('TypeParameterModifier'),
              'Identifier',
              g.optional('TypeBound')]
  ],
  TypeParameterModifier: [
     ['Annotation']
  ],
  TypeBound: [
     [g.literal('extends'), 'TypeVariable'],
     [g.literal('extends'), 'ClassOrInterfaceType', g.multiple('AdditionalBound')]
  ],
  AdditionalBound: [
     [g.literal('&amp;'), 'InterfaceType']
  ],
  TypeArguments: [
     [g.literal('&lt;'), 'TypeArgumentList', g.literal('&gt;')]
  ],
  TypeArgumentList: [
     ['TypeArgument', g.multiple(g.literal(','), 'TypeArgument')]
  ],
  TypeArgument: [
     ['ReferenceType'],
     ['Wildcard']
  ],
  Wildcard: [
     [g.multiple('Annotation'), g.literal('?'), g.optional('WildcardBounds')]
  ],
  WildcardBounds: [
     [g.literal('extends'), 'ReferenceType'],
     [g.literal('super'), 'ReferenceType']
  ],
  ModuleName: [
     ['Identifier'],
     ['ModuleName', g.literal('.'), 'Identifier']
  ],
  PackageName: [
     ['Identifier'],
     ['PackageName', g.literal('.'), 'Identifier']
  ],
  TypeName: [
     ['Identifier'],
     ['PackageOrTypeName', g.literal('.'), 'Identifier']
  ],
  ExpressionName: [
     ['Identifier'],
     ['AmbiguousName', g.literal('.'), 'Identifier']
  ],
  MethodName: [
     ['Identifier']
  ],
  PackageOrTypeName: [
     ['Identifier'],
     ['PackageOrTypeName', g.literal('.'), 'Identifier']
  ],
  AmbiguousName: [
     ['Identifier'],
     ['AmbiguousName', g.literal('.'), 'Identifier']
  ],
  CompilationUnit: [
     ['OrdinaryCompilationUnit'],
     ['ModularCompilationUnit']
  ],
  OrdinaryCompilationUnit: [
     [g.optional('PackageDeclaration'), 
              g.multiple('ImportDeclaration'), 
              g.multiple('TypeDeclaration')]
  ],
  ModularCompilationUnit: [
     [g.multiple('ImportDeclaration'), 
              'ModuleDeclaration']
  ],
  PackageDeclaration: [
     [g.multiple('PackageModifier'),
              g.literal('package'), 
              'Identifier', g.multiple(g.literal('.'), 'Identifier'),
              g.literal(';')]
  ],
  PackageModifier: [
     ['Annotation']
  ],
  ImportDeclaration: [
     ['SingleTypeImportDeclaration'],
     ['TypeImportOnDemandDeclaration'],
     ['SingleStaticImportDeclaration'],
     ['StaticImportOnDemandDeclaration']
  ],
  SingleTypeImportDeclaration: [
     [g.literal('import'), 'TypeName', g.literal(';')]
  ],
  TypeImportOnDemandDeclaration: [
     [g.literal('import'), 'PackageOrTypeName', g.literal('.'), g.literal('*'), g.literal(';')]
  ],
  SingleStaticImportDeclaration: [
     [g.literal('import'), g.literal('static'), 'TypeName', g.literal('.'), 'Identifier', g.literal(';')]
  ],
  StaticImportOnDemandDeclaration: [
     [g.literal('import'), g.literal('static'), 'TypeName', g.literal('.'), g.literal('*'), g.literal(';')]
  ],
  TypeDeclaration: [
     ['ClassDeclaration'],
     ['InterfaceDeclaration'],
     [g.literal(';')]
  ],
  ModuleDeclaration: [
     [g.multiple('Annotation'), g.optional(g.literal('open')), g.literal('module'), 
              'Identifier', g.multiple(g.literal('.'), 'Identifier'),
               g.literal('{'), 'ModuleDirective', g.literal('}')]
  ],
  ModuleDirective: [
     [g.literal('requires'),
              g.multiple('RequiresModifier'), 
              'ModuleName', g.literal(';')],
     [g.literal('exports'), 'PackageName', 
              g.optional(g.literal('to'), 'ModuleName', 
               g.multiple(g.literal(','), 'ModuleName')), g.literal(';')],
     [g.literal('opens'), 'PackageName',
              g.optional(g.literal('to'), 'ModuleName', 
               g.multiple(g.literal(','), 'ModuleName')), g.literal(';')],
     [g.literal('uses'), 'TypeName', g.literal(';')],
     [g.literal('provides'), 'TypeName', 
              g.literal('with'), 'TypeName', 
              g.multiple(g.literal(','), 'TypeName'), g.literal(';')]
  ],
  RequiresModifier: [
     [g.literal('transitive')],
     [g.literal('static')]
  ],
  ClassDeclaration: [
     ['NormalClassDeclaration'],
     ['EnumDeclaration']
  ],
  NormalClassDeclaration: [
     [g.multiple('ClassModifier'),
              g.literal('class'), 'Identifier',
              g.optional('TypeParameters'),
              
              g.optional('Superclass'),
              g.optional('Superinterfaces'),
              'ClassBody']
  ],
  ClassModifier: [
     ['Annotation', g.literal('public'), g.literal('protected'), g.literal('private')],
     [g.literal('abstract'), g.literal('static'), g.literal('final'), g.literal('strictfp')]
  ],
  TypeParameters: [
     [g.literal('&lt;'), 'TypeParameterList', g.literal('&gt;')]
  ],
  TypeParameterList: [
     ['TypeParameter', g.multiple(g.literal(','), 'TypeParameter')]
  ],
  Superclass: [
     [g.literal('extends'), 'ClassType']
  ],
  Superinterfaces: [
     [g.literal('implements'), 'InterfaceTypeList']
  ],
  InterfaceTypeList: [
     ['InterfaceType', g.multiple(g.literal(','), 'InterfaceType')]
  ],
  ClassBody: [
     [g.literal('{'), g.multiple('ClassBodyDeclaration'), g.literal('}')]
  ],
  ClassBodyDeclaration: [
     ['ClassMemberDeclaration'],
     ['InstanceInitializer'],
     ['StaticInitializer'],
     ['ConstructorDeclaration']
  ],
  ClassMemberDeclaration: [
     ['FieldDeclaration'],
     ['MethodDeclaration'],
     ['ClassDeclaration'],
     ['InterfaceDeclaration'],
     [g.literal(';')]
  ],
  FieldDeclaration: [
     [g.multiple('FieldModifier'),
              'UnannType',
              'VariableDeclaratorList', g.literal(';')]
  ],
  FieldModifier: [
     ['Annotation'],
     [g.literal('public')],
     [g.literal('protected')],
     [g.literal('private')],
     [g.literal('static')],
     [g.literal('final')],
     [g.literal('transient')],
     [g.literal('volatile')]
  ],
  VariableDeclaratorList: [
     ['VariableDeclarator', g.multiple(g.literal(','), 'VariableDeclarator')]
  ],
  VariableDeclarator: [
     ['VariableDeclaratorId', g.optional(g.literal('='), 'VariableInitializer')]
  ],
  VariableDeclaratorId: [
     ['Identifier', g.optional('Dims')]
  ],
  VariableInitializer: [
     ['Expression'],
     ['ArrayInitializer']
  ],
  UnannType: [
     ['UnannPrimitiveType'],
     ['UnannReferenceType']
  ],
  UnannPrimitiveType: [
     ['NumericType'],
     [g.literal('boolean')]
  ],
  UnannReferenceType: [
     ['UnannClassOrInterfaceType'],
     ['UnannTypeVariable'],
     ['UnannArrayType']
  ],
  UnannClassOrInterfaceType: [
     ['UnannClassType'],
     ['UnannInterfaceType']
  ],
  UnannClassType: [
     ['Identifier',
              g.optional('TypeArguments')],
     ['UnannClassOrInterfaceType', g.literal('.'),
              g.multiple('Annotation'),
              'Identifier',
              g.optional('TypeArguments')]
  ],
  UnannInterfaceType: [
     ['UnannClassType']
  ],
  UnannTypeVariable: [
     ['Identifier']
  ],
  UnannArrayType: [
     ['UnannPrimitiveType', 'Dims'],
     ['UnannClassOrInterfaceType', 'Dims'],
     ['UnannTypeVariable', 'Dims']
  ],
  MethodDeclaration: [
     [g.multiple('MethodModifier'), 'MethodHeader', 'MethodBody']
  ],
  MethodModifier: [
     ['Annotation'],
     [g.literal('public')],
     [g.literal('protected')],
     [g.literal('private')],
     [g.literal('abstract')],
     [g.literal('static')],
     [g.literal('final')],
     [g.literal('synchronized')],
     [g.literal('native')],
     [g.literal('strictfp')]
  ],
  MethodHeader: [
     ['Result', 'MethodDeclarator', g.optional('Throws')],
     ['TypeParameters', g.multiple('Annotation'),
              'Result', 'MethodDeclarator', g.optional('Throws')]
  ],
  Result: [
     ['UnannType'],
     [g.literal('void')]
  ],
  MethodDeclarator: [
     ['Identifier',
               g.literal('('), g.optional('FormalParameterList'), g.literal(')'),
               g.optional('Dims')]
  ],
  FormalParameterList: [
     ['ReceiverParameter'],
     ['FormalParameters', g.literal(','), 'LastFormalParameter'],
     ['LastFormalParameter']
  ],
  FormalParameters: [
     ['FormalParameter', g.multiple(g.literal(','), 'FormalParameter')],
     ['ReceiverParameter', g.multiple(g.literal(','), 'FormalParameter')]
  ],
  FormalParameter: [
     [g.multiple('VariableModifier'),
              'UnannType',
              'VariableDeclaratorId']
  ],
  VariableModifier: [
     ['Annotation'],
     [g.literal('final')]
  ],
  LastFormalParameter: [
     [g.multiple('VariableModifier'),
              'UnannType', g.multiple('Annotation'), g.literal('...'),
              'VariableDeclaratorId'],
     ['FormalParameter']
  ],
  ReceiverParameter: [
     [g.multiple('Annotation'),
              'UnannType',
              g.optional('Identifier', g.literal('.')), g.literal('this')]
  ],
  Throws: [
     [g.literal('throws'), 'ExceptionTypeList']
  ],
  ExceptionTypeList: [
     ['ExceptionType', g.multiple(g.literal(','), 'ExceptionType')]
  ],
  ExceptionType: [
     ['ClassType'],
     ['TypeVariable']
  ],
  MethodBody: [
     ['Block'],
     [g.literal(';')]
  ],
  InstanceInitializer: [
     ['Block']
  ],
  StaticInitializer: [
     [g.literal('static'), 'Block']
  ],
  ConstructorDeclaration: [
     [g.multiple('ConstructorModifier'),
              'ConstructorDeclarator',
              g.optional('Throws'),
              'ConstructorBody']
  ],
  ConstructorModifier: [
     ['Annotation'],
     [g.literal('public')],
     [g.literal('protected')],
     [g.literal('private')]
  ],
  ConstructorDeclarator: [
     [g.optional('TypeParameters'),
              'SimpleTypeName',
              g.literal('('), g.optional('FormalParameterList'), g.literal(')')]
  ],
  SimpleTypeName: [
     ['Identifier']
  ],
  ConstructorBody: [
     [g.literal('{'),
              g.optional('ExplicitConstructorInvocation'),
              g.optional('BlockStatements'),
              g.literal('}')]
  ],
  ExplicitConstructorInvocation: [
     [g.optional('TypeArguments'), g.literal('this'), g.literal('('), g.optional('ArgumentList'), g.literal(')'), g.literal(';')],
     [g.optional('TypeArguments'), g.literal('super'), g.literal('('), g.optional('ArgumentList'), g.literal(')'), g.literal(';')],
     ['ExpressionName', g.literal('.'), g.optional('TypeArguments'), g.literal('super'), g.literal('('), g.optional('ArgumentList'), g.literal(')'), g.literal(';')],
     ['Primary', g.literal('.'), g.optional('TypeArguments'), g.literal('super'), g.literal('('), g.optional('ArgumentList'), g.literal(')'), g.literal(';')]
  ],
  EnumDeclaration: [
     [g.multiple('ClassModifier'),
              g.literal('enum'), 'Identifier',
              g.optional('Superinterfaces'),
              'EnumBody']
  ],
  EnumBody: [
     [g.literal('{'),
              g.optional('EnumConstantList'), g.optional(g.literal(',')),
              g.optional('EnumBodyDeclarations'),
              g.literal('}')]
  ],
  EnumConstantList: [
     ['EnumConstant', g.multiple(g.literal(','), 'EnumConstant')]
  ],
  EnumConstant: [
     [g.multiple('EnumConstantModifier'),
              'Identifier',
              g.optional(g.literal('('), 'ArgumentList', g.literal(')')),
              g.optional('ClassBody')]
  ],
  EnumConstantModifier: [
     ['Annotation']
  ],
  EnumBodyDeclarations: [
     [g.literal(';'), g.multiple('ClassBodyDeclaration')]
  ],
  InterfaceDeclaration: [
     ['NormalInterfaceDeclaration'],
     ['AnnotationTypeDeclaration']
  ],
  NormalInterfaceDeclaration: [
     [g.multiple('InterfaceModifier'), 
              g.literal('interface'), 'Identifier',
              g.optional('TypeParameters'),
              g.optional('ExtendsInterfaces'),
              'InterfaceBody']
  ],
  InterfaceModifier: [
     ['Annotation'],
     [g.literal('public')],
     [g.literal('protected')],
     [g.literal('private')],
     [g.literal('abstract')],
     [g.literal('static')],
     [g.literal('strictfp')]
  ],
  ExtendsInterfaces: [
     [g.literal('extends'), 'InterfaceTypeList']
  ],
  InterfaceBody: [
     [g.literal('{'), g.multiple('InterfaceMemberDeclaration'), g.literal('}')]
  ],
  InterfaceMemberDeclaration: [
     ['ConstantDeclaration'],
     ['InterfaceMethodDeclaration'],
     ['ClassDeclaration'],
     ['InterfaceDeclaration'],
     [g.literal(';')]
  ],
  ConstantDeclaration: [
     [g.multiple('ConstantModifier'),
              'UnannType',
              'VariableDeclaratorList', g.literal(';')]
  ],
  ConstantModifier: [
     ['Annotation'],
     [g.literal('public')],
     [g.literal('static')],
     [g.literal('final')]
  ],
  InterfaceMethodDeclaration: [
     [g.multiple('InterfaceMethodModifier'),
              'MethodHeader',
              'MethodBody']
  ],
  InterfaceMethodModifier: [
     ['Annotation'],
     [g.literal('public')],
     [g.literal('private')],
     [g.literal('abstract')],
     [g.literal('default')],
     [g.literal('static')],
     [g.literal('strictfp')]
  ],
  AnnotationTypeDeclaration: [
     [g.multiple('InterfaceModifier'),
              g.literal('@'), g.literal('interface'), 'Identifier',
              'AnnotationTypeBody']
  ],
  AnnotationTypeBody: [
     [g.literal('{'),
              g.multiple('AnnotationTypeMemberDeclaration'),
              g.literal('}')]
  ],
  AnnotationTypeMemberDeclaration: [
     ['AnnotationTypeElementDeclaration'],
     ['ConstantDeclaration'],
     ['ClassDeclaration'],
     ['InterfaceDeclaration'],
     [g.literal(';')]
  ],
  AnnotationTypeElementDeclaration: [
     [g.multiple('AnnotationTypeElementModifier'),
              'UnannType', 'Identifier', 
              g.literal('('), g.literal(')'), g.optional('Dims'),
              
              g.optional('DefaultValue'), g.literal(';')]
  ],
  AnnotationTypeElementModifier: [
     ['Annotation'],
     [g.literal('public')],
     [g.literal('abstract')]
  ],
  DefaultValue: [
     [g.literal('default'), 'ElementValue']
  ],
  Annotation: [
     ['NormalAnnotation'],
     ['MarkerAnnotation'],
     ['SingleElementAnnotation']
  ],
  NormalAnnotation: [
     [g.literal('@'), 'TypeName',
              g.literal('('), g.optional('ElementValuePairList'), g.literal(')')]
  ],
  ElementValuePairList: [
     ['ElementValuePair', g.multiple(g.literal(','), 'ElementValuePair')]
  ],
  ElementValuePair: [
     ['Identifier', g.literal('='), 'ElementValue']
  ],
  ElementValue: [
     ['ConditionalExpression'],
     ['ElementValueArrayInitializer'],
     ['Annotation']
  ],
  ElementValueArrayInitializer: [
     [g.literal('{'), g.optional('ElementValueList'), g.optional(g.literal(',')), g.literal('}')]
  ],
  ElementValueList: [
     ['ElementValue', g.multiple(g.literal(','), 'ElementValue')]
  ],
  MarkerAnnotation: [
     [g.literal('@'), 'TypeName']
  ],
  SingleElementAnnotation: [
     [g.literal('@'), 'TypeName',
              g.literal('('), 'ElementValue', g.literal(')')]
  ],
  ArrayInitializer: [
     [g.literal('{'), g.optional('VariableInitializerList'), g.optional(g.literal(',')), g.literal('}')]
  ],
  VariableInitializerList: [
     ['VariableInitializer', g.multiple(g.literal(','), 'VariableInitializer')]
  ],
  Block: [
     [g.literal('{'), g.optional('BlockStatements'), g.literal('}')]
  ],
  BlockStatements: [
     ['BlockStatement', g.multiple('BlockStatement')]
  ],
  BlockStatement: [
     ['LocalVariableDeclarationStatement'],
     ['ClassDeclaration'],
     ['Statement']
  ],
  LocalVariableDeclarationStatement: [
     ['LocalVariableDeclaration', g.literal(';')]
  ],
  LocalVariableDeclaration: [
     [g.multiple('VariableModifier'),
              'UnannType',
              'VariableDeclaratorList']
  ],
  Statement: [
     ['StatementWithoutTrailingSubstatement'],
     ['LabeledStatement'],
     ['IfThenStatement'],
     ['IfThenElseStatement'],
     ['WhileStatement'],
     ['ForStatement']
  ],
  StatementNoShortIf: [
     ['StatementWithoutTrailingSubstatement'],
     ['LabeledStatementNoShortIf'],
     ['IfThenElseStatementNoShortIf'],
     ['WhileStatementNoShortIf'],
     ['ForStatementNoShortIf']
  ],
  StatementWithoutTrailingSubstatement: [
     ['Block'],
     ['EmptyStatement'],
     ['ExpressionStatement'],
     ['AssertStatement'],
     ['SwitchStatement'],
     ['DoStatement'],
     ['BreakStatement'],
     ['ContinueStatement'],
     ['ReturnStatement'],
     ['SynchronizedStatement'],
     ['ThrowStatement'],
     ['TryStatement']
  ],
  EmptyStatement: [
     [g.literal(';')]
  ],
  LabeledStatement: [
     ['Identifier', g.literal(':'),
              'Statement']
  ],
  LabeledStatementNoShortIf: [
     ['Identifier', g.literal(':'),
              'StatementNoShortIf']
  ],
  ExpressionStatement: [
     ['StatementExpression', g.literal(';')]
  ],
  StatementExpression: [
     ['Assignment'],
     ['PreIncrementExpression'],
     ['PreDecrementExpression'],
     ['PostIncrementExpression'],
     ['PostDecrementExpression'],
     ['MethodInvocation'],
     ['ClassInstanceCreationExpression']
  ],
  IfThenStatement: [
     [g.literal('if'), g.literal('('), 'Expression', g.literal(')'),
              'Statement']
  ],
  IfThenElseStatement: [
     [g.literal('if'), g.literal('('), 'Expression', g.literal(')'),
              'StatementNoShortIf',
              g.literal('else'), 'Statement']
  ],
  IfThenElseStatementNoShortIf: [
     [g.literal('if'), g.literal('('), 'Expression', g.literal(')'),
              'StatementNoShortIf',
              g.literal('else'), 'StatementNoShortIf']
  ],
  AssertStatement: [
     [g.literal('assert'), 'Expression', g.literal(';')],
     [g.literal('assert'), 'Expression', g.literal(':'), 'Expression', g.literal(';')]
  ],
  SwitchStatement: [
     [g.literal('switch'), g.literal('('), 'Expression', g.literal(')'),
              'SwitchBlock']
  ],
  SwitchBlock: [
     [g.literal('{'),
              g.multiple('SwitchBlockStatementGroup'),
              g.multiple('SwitchLabel'),
              g.literal('}')]
  ],
  SwitchBlockStatementGroup: [
     ['SwitchLabels', 'BlockStatements']
  ],
  SwitchLabels: [
     ['SwitchLabel', g.multiple('SwitchLabel')]
  ],
  SwitchLabel: [
     [g.literal('case'), 'ConstantExpression', g.literal(':')],
     [g.literal('case'), 'EnumConstantName', g.literal(':')],
     [g.literal('default'), g.literal(':')]
  ],
  EnumConstantName: [
     ['Identifier']
  ],
  WhileStatement: [
     [g.literal('while'), g.literal('('), 'Expression', g.literal(')'),
              'Statement']
  ],
  WhileStatementNoShortIf: [
     [g.literal('while'), g.literal('('), 'Expression', g.literal(')'),
              'StatementNoShortIf']
  ],
  DoStatement: [
     [g.literal('do'), 'Statement', g.literal('while'),
              g.literal('('), 'Expression', g.literal(')'), g.literal(';')]
  ],
  ForStatement: [
     ['BasicForStatement'],
     ['EnhancedForStatement']
  ],
  ForStatementNoShortIf: [
     ['BasicForStatementNoShortIf'],
     ['EnhancedForStatementNoShortIf']
  ],
  BasicForStatement: [
     [g.literal('for'), g.literal('('),
              g.optional('ForInit'), g.literal(';'),
              g.optional('Expression'), g.literal(';'),
              g.optional('ForUpdate'),
              g.literal(')'), 'Statement']
  ],
  BasicForStatementNoShortIf: [
     [g.literal('for'), g.literal('('),
              g.optional('ForInit'), g.literal(';'),
              g.optional('Expression'), g.literal(';'),
              g.optional('ForUpdate'),
              g.literal(')'), 'StatementNoShortIf']
  ],
  ForInit: [
     ['StatementExpressionList'],
     ['LocalVariableDeclaration']
  ],
  ForUpdate: [
     ['StatementExpressionList']
  ],
  StatementExpressionList: [
     ['StatementExpression', g.multiple(g.literal(','), 'StatementExpression')]
  ],
  EnhancedForStatement: [
     [g.literal('for'), g.literal('('), 
              g.multiple('VariableModifier'),
              'UnannType', 
              'VariableDeclaratorId', 
              
              g.literal(':'), 'Expression',
              g.literal(')'),
              
              'Statement']
  ],
  EnhancedForStatementNoShortIf: [
     [g.literal('for'), g.literal('('), 
              g.multiple('VariableModifier'),
              'UnannType', 
              'VariableDeclaratorId',
              
              g.literal(':'), 'Expression',
              g.literal(')'),
              
              'StatementNoShortIf']
  ],
  BreakStatement: [
     [g.literal('break'), g.optional('Identifier'), g.literal(';')]
  ],
  ContinueStatement: [
     [g.literal('continue'), g.optional('Identifier'), g.literal(';')]
  ],
  ReturnStatement: [
     [g.literal('return'), g.optional('Expression'), g.literal(';')]
  ],
  ThrowStatement: [
     [g.literal('throw'), 'Expression', g.literal(';')]
  ],
  SynchronizedStatement: [
     [g.literal('synchronized'),
              g.literal('('), 'Expression', g.literal(')'),
              'Block']
  ],
  TryStatement: [
     [g.literal('try'), 'Block', 'Catches'],
     [g.literal('try'), 'Block', g.optional('Catches'), 'Finally'],
     ['TryWithResourcesStatement']
  ],
  Catches: [
     ['CatchClause', g.multiple('CatchClause')]
  ],
  CatchClause: [
     [g.literal('catch'),
              g.literal('('), 'CatchFormalParameter', g.literal(')'),
              'Block']
  ],
  CatchFormalParameter: [
     [g.multiple('VariableModifier'),
              'CatchType',
              'VariableDeclaratorId']
  ],
  CatchType: [
     ['UnannClassType',
              g.multiple(g.literal('|'), 'ClassType')]
  ],
  Finally: [
     [g.literal('finally'), 'Block']
  ],
  TryWithResourcesStatement: [
     [g.literal('try'),
              'ResourceSpecification',
              'Block',
              g.optional('Catches'),
              g.optional('Finally')]
  ],
  ResourceSpecification: [
     [g.literal('('), 'ResourceList', g.optional(g.literal(';')), g.literal(')')]
  ],
  ResourceList: [
     ['Resource', g.multiple(g.literal(';'), 'Resource')]
  ],
  Resource: [
     [g.multiple('VariableModifier'),
              'UnannType',
              'VariableDeclaratorId',
              g.literal('='), 'Expression'],
     ['VariableAccess']
  ],
  Primary: [
     ['PrimaryNoNewArray'],
     ['ArrayCreationExpression']
  ],
  PrimaryNoNewArray: [
     ['Literal'],
     ['ClassLiteral'],
     [g.literal('this')],
     ['TypeName', g.literal('.'), g.literal('this')],
     [g.literal('('), 'Expression', g.literal(')')],
     ['ClassInstanceCreationExpression'],
     ['FieldAccess'],
     ['ArrayAccess'],
     ['MethodInvocation'],
     ['MethodReference']
  ],
  ClassLiteral: [
     ['TypeName', g.multiple(g.literal('['), g.literal(']')), g.literal('.'), g.literal('class')],
     ['NumericType', g.multiple(g.literal('['), g.literal(']')), g.literal('.'), g.literal('class')],
     [g.literal('boolean'), g.multiple(g.literal('['), g.literal(']')), g.literal('.'), g.literal('class')],
     [g.literal('void'), g.literal('.'), g.literal('class')]
  ],
  ClassInstanceCreationExpression: [
     [
              
              'UnqualifiedClassInstanceCreationExpression'],
     ['ExpressionName', g.literal('.'), 'UnqualifiedClassInstanceCreationExpression'],
     ['Primary', g.literal('.'), 'UnqualifiedClassInstanceCreationExpression']
  ],
  UnqualifiedClassInstanceCreationExpression: [
     [g.literal('new'), g.optional('TypeArguments'),
              
              'ClassOrInterfaceTypeToInstantiate',
              g.literal('('), g.optional('ArgumentList'), g.literal(')'), g.optional('ClassBody')]
  ],
  ClassOrInterfaceTypeToInstantiate: [
     [g.multiple('Annotation'), 'Identifier',
              g.multiple(g.literal('.'), g.multiple('Annotation'), 'Identifier',),
              g.optional('TypeArgumentsOrDiamond')]
  ],
  TypeArgumentsOrDiamond: [
     ['TypeArguments'],
     [g.literal('&lt;&gt;')]
  ],
  FieldAccess: [
     ['Primary', g.literal('.'), 'Identifier'],
     [g.literal('super'), g.literal('.'), 'Identifier'],
     ['TypeName', g.literal('.'), g.literal('super'), g.literal('.'), 'Identifier']
  ],
  ArrayAccess: [
     ['ExpressionName', g.literal('['), 'Expression', g.literal(']')],
     ['PrimaryNoNewArray', g.literal('['), 'Expression', g.literal(']')]
  ],
  MethodInvocation: [
     [
              
              'MethodName', g.literal('('), g.optional('ArgumentList'), g.literal(')')],
     ['TypeName', g.literal('.'), g.optional('TypeArguments'), 'Identifier',
              g.literal('('), g.optional('ArgumentList'), g.literal(')')],
     ['ExpressionName', g.literal('.'), g.optional('TypeArguments'), 'Identifier',
              g.literal('('), g.optional('ArgumentList'), g.literal(')')],
     ['Primary', g.literal('.'), g.optional('TypeArguments'), 'Identifier',
              g.literal('('), g.optional('ArgumentList'), g.literal(')')],
     [g.literal('super'), g.literal('.'), g.optional('TypeArguments'), 'Identifier',
              g.literal('('), g.optional('ArgumentList'), g.literal(')')],
     ['TypeName', g.literal('.'), g.literal('super'), g.literal('.'), g.optional('TypeArguments'), 'Identifier',
              g.literal('('), g.optional('ArgumentList'), g.literal(')')]
  ],
  ArgumentList: [
     ['Expression', g.multiple(g.literal(','), 'Expression')]
  ],
  MethodReference: [
     [
              
              'ExpressionName', g.literal('::'),
              g.optional('TypeArguments'), 'Identifier'],
     ['Primary', g.literal('::'),
              g.optional('TypeArguments'), 'Identifier'],
     ['ReferenceType', g.literal('::'),
              g.optional('TypeArguments'), 'Identifier'],
     [g.literal('super'), g.literal('::'),
              g.optional('TypeArguments'), 'Identifier'],
     ['TypeName', g.literal('.'), g.literal('super'), g.literal('::'),
              g.optional('TypeArguments'), 'Identifier'],
     ['ClassType', g.literal('::'),
              g.optional('TypeArguments'), g.literal('new')],
     ['ArrayType', g.literal('::'), g.literal('new')]
  ],
  ArrayCreationExpression: [
     [g.literal('new'), 'PrimitiveType', 'DimExprs', g.optional('Dims')],
     [g.literal('new'), 'ClassOrInterfaceType', 'DimExprs', g.optional('Dims')],
     [g.literal('new'), 'PrimitiveType', 'Dims', 'ArrayInitializer'],
     [g.literal('new'), 'ClassOrInterfaceType', 'Dims', 'ArrayInitializer']
  ],
  DimExprs: [
     ['DimExpr', g.multiple('DimExpr')]
  ],
  DimExpr: [
     [g.multiple('Annotation'), g.literal('['), 'Expression', g.literal(']')]
  ],
  Expression: [
     ['AssignmentExpression'],
     ['LambdaExpression']
  ],
  LambdaExpression: [
     ['LambdaParameters', g.literal('-&gt;'), 'LambdaBody']
  ],
  LambdaParameters: [
     ['Identifier'],
     [g.literal('('), g.optional('FormalParameterList'), g.literal(')')],
     [g.literal('('), 'InferredFormalParameterList', g.literal(')')]
  ],
  InferredFormalParameterList: [
     ['Identifier', g.multiple(g.literal(','), 'Identifier')]
  ],
  LambdaBody: [
     ['Expression'],
     ['Block']
  ],
  AssignmentExpression: [
     ['ConditionalExpression'],
     ['Assignment']
  ],
  Assignment: [
     ['LeftHandSide', 'AssignmentOperator', 'Expression']
  ],
  LeftHandSide: [
     ['ExpressionName'],
     ['FieldAccess'],
     ['ArrayAccess']
  ],
  AssignmentOperator: [
     [g.literal('=')],
     [g.literal('*=')],
     [g.literal('/=')],
     [g.literal('%=')],
     [g.literal('+=')],
     [g.literal('-=')],
     [g.literal('&lt;&lt;=')],
     [g.literal('&gt;&gt;=')],
     [g.literal('&gt;&gt;&gt;=')],
     [g.literal('&amp;=')],
     [g.literal('^=')],
     [g.literal('|='),
            ]
  ],
  ConditionalExpression: [
     ['ConditionalOrExpression'],
     ['ConditionalOrExpression', g.literal('?'), 
              'Expression', g.literal(':'), 
              'ConditionalExpression'],
      ['ConditionalOrExpression', g.literal('?'), 
              'Expression', g.literal(':'), 
              'LambdaExpression']
  ],
  ConditionalOrExpression: [
     ['ConditionalAndExpression'],
     ['ConditionalOrExpression', g.literal('||'), 'ConditionalAndExpression']
  ],
  ConditionalAndExpression: [
     ['InclusiveOrExpression'],
     ['ConditionalAndExpression', g.literal('&amp;&amp;'), 'InclusiveOrExpression']
  ],
  InclusiveOrExpression: [
     ['ExclusiveOrExpression'],
     ['InclusiveOrExpression', g.literal('|'), 'ExclusiveOrExpression']
  ],
  ExclusiveOrExpression: [
     ['AndExpression'],
     ['ExclusiveOrExpression', g.literal('^'), 'AndExpression']
  ],
  AndExpression: [
     ['EqualityExpression'],
     ['AndExpression', g.literal('&amp;'), 'EqualityExpression']
  ],
  EqualityExpression: [
     ['RelationalExpression'],
     ['EqualityExpression', g.literal('=='), 'RelationalExpression'],
     ['EqualityExpression', g.literal('!='), 'RelationalExpression']
  ],
  RelationalExpression: [
     ['ShiftExpression'],
     ['RelationalExpression', g.literal('&lt;'), 'ShiftExpression'],
     ['RelationalExpression', g.literal('&gt;'), 'ShiftExpression'],
     ['RelationalExpression', g.literal('&lt;='), 'ShiftExpression'],
     ['RelationalExpression', g.literal('&gt;='), 'ShiftExpression'],
     ['RelationalExpression', g.literal('instanceof'), 'ReferenceType']
  ],
  ShiftExpression: [
     ['AdditiveExpression'],
     ['ShiftExpression', g.literal('&lt;&lt;'), 'AdditiveExpression'],
     ['ShiftExpression', g.literal('&gt;&gt;'), 'AdditiveExpression'],
     ['ShiftExpression', g.literal('&gt;&gt;&gt;'), 'AdditiveExpression']
  ],
  AdditiveExpression: [
     ['MultiplicativeExpression'],
     ['AdditiveExpression', g.literal('+'), 'MultiplicativeExpression'],
     ['AdditiveExpression', g.literal('-'), 'MultiplicativeExpression']
  ],
  MultiplicativeExpression: [
     ['UnaryExpression'],
     ['MultiplicativeExpression', g.literal('*'), 'UnaryExpression'],
     ['MultiplicativeExpression', g.literal('/'), 'UnaryExpression'],
     ['MultiplicativeExpression', g.literal('%'), 'UnaryExpression']
  ],
  UnaryExpression: [
     ['UnaryExpressionNotPlusMinus'],
     ['PreIncrementExpression'],
     ['PreDecrementExpression'],
     [g.literal('+'), 'UnaryExpression'],
     [g.literal('-'), 'UnaryExpression']
  ],
  PreIncrementExpression: [
     [g.literal('++'), 'UnaryExpression']
  ],
  PreDecrementExpression: [
     [g.literal('--'), 'UnaryExpression']
  ],
  UnaryExpressionNotPlusMinus: [
     ['PostfixExpression'],
     [g.literal('~'), 'UnaryExpression'],
     [g.literal('!'), 'UnaryExpression'],
     ['CastExpression']
  ],
  PostfixExpression: [
     ['Primary'],
     ['ExpressionName'],
     ['PostIncrementExpression'],
     ['PostDecrementExpression']
  ],
  PostIncrementExpression: [
     ['PostfixExpression', g.literal('++')]
  ],
  PostDecrementExpression: [
     ['PostfixExpression', g.literal('--')]
  ],
  CastExpression: [
     [g.literal('('), 'PrimitiveType', g.literal(')'),
              'UnaryExpression'],
     [g.literal('('), 'ReferenceType', g.multiple('AdditionalBound'), g.literal(')'),
              'UnaryExpressionNotPlusMinus'],
     [g.literal('('), 'ReferenceType', g.multiple('AdditionalBound'), g.literal(')'),
              'LambdaExpression']
  ],
  ConstantExpression: [
     ['Expression']
  ]
};

})();
