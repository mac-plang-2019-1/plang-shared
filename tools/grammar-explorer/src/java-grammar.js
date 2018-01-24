console.log("Loading grammar...");
grammar = {
  Identifier: [
     ['IdentifierChars']
  ],
  IdentifierChars: [
     [textInput("identifier", "[A-Za-z_][A-Za-z0-9_]+")]
  ],

  IntegerLiteral:       [[textInput("integer")]],
  FloatingPointLiteral: [[textInput("floating")]],
  BooleanLiteral:       [[textInput("boolean")]],
  CharacterLiteral:     [[textInput("character")]],
  StringLiteral:        [[textInput("string")]],
  NullLiteral:          [[literal("null")]],

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
     [multiple('Annotation'), 'NumericType'],
     [multiple('Annotation'), literal('boolean')]
  ],
  NumericType: [
     ['IntegralType'],
     ['FloatingPointType']
  ],
  IntegralType: [
     [literal('byte')],
     [literal('short')],
     [literal('int')],
     [literal('long')],
     [literal('char')]
  ],
  FloatingPointType: [
     [literal('float')],
     [literal('double')]
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
     [multiple('Annotation'), 
              'Identifier',
              optional('TypeArguments')],
     ['ClassOrInterfaceType', literal('.'), 
              multiple('Annotation'),
              'Identifier', 
              optional('TypeArguments')]
  ],
  InterfaceType: [
     ['ClassType']
  ],
  TypeVariable: [
     [multiple('Annotation'), 'Identifier']
  ],
  ArrayType: [
     ['PrimitiveType', 'Dims'],
     ['ClassOrInterfaceType', 'Dims'],
     ['TypeVariable', 'Dims']
  ],
  Dims: [
     [multiple('Annotation'), literal('['), literal(']'), multiple(multiple('Annotation'), literal('['), literal(']'))]
  ],
  TypeParameter: [
     [multiple('TypeParameterModifier'),
              'Identifier',
              optional('TypeBound')]
  ],
  TypeParameterModifier: [
     ['Annotation']
  ],
  TypeBound: [
     [literal('extends'), 'TypeVariable'],
     [literal('extends'), 'ClassOrInterfaceType', multiple('AdditionalBound')]
  ],
  AdditionalBound: [
     [literal('&amp;'), 'InterfaceType']
  ],
  TypeArguments: [
     [literal('&lt;'), 'TypeArgumentList', literal('&gt;')]
  ],
  TypeArgumentList: [
     ['TypeArgument', multiple(literal(','), 'TypeArgument')]
  ],
  TypeArgument: [
     ['ReferenceType'],
     ['Wildcard']
  ],
  Wildcard: [
     [multiple('Annotation'), literal('?'), optional('WildcardBounds')]
  ],
  WildcardBounds: [
     [literal('extends'), 'ReferenceType'],
     [literal('super'), 'ReferenceType']
  ],
  ModuleName: [
     ['Identifier'],
     ['ModuleName', literal('.'), 'Identifier']
  ],
  PackageName: [
     ['Identifier'],
     ['PackageName', literal('.'), 'Identifier']
  ],
  TypeName: [
     ['Identifier'],
     ['PackageOrTypeName', literal('.'), 'Identifier']
  ],
  ExpressionName: [
     ['Identifier'],
     ['AmbiguousName', literal('.'), 'Identifier']
  ],
  MethodName: [
     ['Identifier']
  ],
  PackageOrTypeName: [
     ['Identifier'],
     ['PackageOrTypeName', literal('.'), 'Identifier']
  ],
  AmbiguousName: [
     ['Identifier'],
     ['AmbiguousName', literal('.'), 'Identifier']
  ],
  CompilationUnit: [
     ['OrdinaryCompilationUnit'],
     ['ModularCompilationUnit']
  ],
  OrdinaryCompilationUnit: [
     [optional('PackageDeclaration'), 
              multiple('ImportDeclaration'), 
              multiple('TypeDeclaration')]
  ],
  ModularCompilationUnit: [
     [multiple('ImportDeclaration'), 
              'ModuleDeclaration']
  ],
  PackageDeclaration: [
     [multiple('PackageModifier'),
              literal('package'), 
              'Identifier', multiple(literal('.'), 'Identifier'),
              literal(';')]
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
     [literal('import'), 'TypeName', literal(';')]
  ],
  TypeImportOnDemandDeclaration: [
     [literal('import'), 'PackageOrTypeName', literal('.'), literal('*'), literal(';')]
  ],
  SingleStaticImportDeclaration: [
     [literal('import'), literal('static'), 'TypeName', literal('.'), 'Identifier', literal(';')]
  ],
  StaticImportOnDemandDeclaration: [
     [literal('import'), literal('static'), 'TypeName', literal('.'), literal('*'), literal(';')]
  ],
  TypeDeclaration: [
     ['ClassDeclaration'],
     ['InterfaceDeclaration'],
     [literal(';')]
  ],
  ModuleDeclaration: [
     [multiple('Annotation'), optional(literal('open')), literal('module'), 
              'Identifier', multiple(literal('.'), 'Identifier'),
               literal('{'), 'ModuleDirective', literal('}')]
  ],
  ModuleDirective: [
     [literal('requires'),
              multiple('RequiresModifier'), 
              'ModuleName', literal(';')],
     [literal('exports'), 'PackageName', 
              optional(literal('to'), 'ModuleName', 
               multiple(literal(','), 'ModuleName')), literal(';')],
     [literal('opens'), 'PackageName',
              optional(literal('to'), 'ModuleName', 
               multiple(literal(','), 'ModuleName')), literal(';')],
     [literal('uses'), 'TypeName', literal(';')],
     [literal('provides'), 'TypeName', 
              literal('with'), 'TypeName', 
               multiple(literal(','), 'TypeName'), literal(';')]
  ],
  RequiresModifier: [
     [literal('transitive')],
     [literal('static')]
  ],
  ClassDeclaration: [
     ['NormalClassDeclaration'],
     ['EnumDeclaration']
  ],
  NormalClassDeclaration: [
     [multiple('ClassModifier'),
              literal('class'), 'Identifier',
              optional('TypeParameters'),
              
              optional('Superclass'),
              optional('Superinterfaces'),
              'ClassBody']
  ],
  ClassModifier: [
     ['Annotation', literal('public'), literal('protected'), literal('private')],
     [literal('abstract'), literal('static'), literal('final'), literal('strictfp')]
  ],
  TypeParameters: [
     [literal('&lt;'), 'TypeParameterList', literal('&gt;')]
  ],
  TypeParameterList: [
     ['TypeParameter', multiple(literal(','), 'TypeParameter')]
  ],
  Superclass: [
     [literal('extends'), 'ClassType']
  ],
  Superinterfaces: [
     [literal('implements'), 'InterfaceTypeList']
  ],
  InterfaceTypeList: [
     ['InterfaceType', multiple(literal(','), 'InterfaceType')]
  ],
  ClassBody: [
     [literal('{'), multiple('ClassBodyDeclaration'), literal('}')]
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
     [literal(';')]
  ],
  FieldDeclaration: [
     [multiple('FieldModifier'),
              'UnannType',
              'VariableDeclaratorList', literal(';')]
  ],
  FieldModifier: [
     ['Annotation'],
     [literal('public')],
     [literal('protected')],
     [literal('private')],
     [literal('static')],
     [literal('final')],
     [literal('transient')],
     [literal('volatile')]
  ],
  VariableDeclaratorList: [
     ['VariableDeclarator', multiple(literal(','), 'VariableDeclarator')]
  ],
  VariableDeclarator: [
     ['VariableDeclaratorId', optional(literal('='), 'VariableInitializer')]
  ],
  VariableDeclaratorId: [
     ['Identifier', optional('Dims')]
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
     [literal('boolean')]
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
              optional('TypeArguments')],
     ['UnannClassOrInterfaceType', literal('.'),
              multiple('Annotation'),
              'Identifier',
              optional('TypeArguments')]
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
     [multiple('MethodModifier'), 'MethodHeader', 'MethodBody']
  ],
  MethodModifier: [
     ['Annotation'],
     [literal('public')],
     [literal('protected')],
     [literal('private')],
     [literal('abstract')],
     [literal('static')],
     [literal('final')],
     [literal('synchronized')],
     [literal('native')],
     [literal('strictfp')]
  ],
  MethodHeader: [
     ['Result', 'MethodDeclarator', optional('Throws')],
     ['TypeParameters', multiple('Annotation'),
              'Result', 'MethodDeclarator', optional('Throws')]
  ],
  Result: [
     ['UnannType'],
     [literal('void')]
  ],
  MethodDeclarator: [
     ['Identifier',
               literal('('), optional('FormalParameterList'), literal(')'),
               optional('Dims')]
  ],
  FormalParameterList: [
     ['ReceiverParameter'],
     ['FormalParameters', literal(','), 'LastFormalParameter'],
     ['LastFormalParameter']
  ],
  FormalParameters: [
     ['FormalParameter', multiple(literal(','), 'FormalParameter')],
     ['ReceiverParameter', multiple(literal(','), 'FormalParameter')]
  ],
  FormalParameter: [
     [multiple('VariableModifier'),
              'UnannType',
              'VariableDeclaratorId']
  ],
  VariableModifier: [
     ['Annotation'],
     [literal('final')]
  ],
  LastFormalParameter: [
     [multiple('VariableModifier'),
              'UnannType', multiple('Annotation'), literal('...'),
              'VariableDeclaratorId'],
     ['FormalParameter']
  ],
  ReceiverParameter: [
     [multiple('Annotation'),
              'UnannType',
              optional('Identifier', literal('.')), literal('this')]
  ],
  Throws: [
     [literal('throws'), 'ExceptionTypeList']
  ],
  ExceptionTypeList: [
     ['ExceptionType', multiple(literal(','), 'ExceptionType')]
  ],
  ExceptionType: [
     ['ClassType'],
     ['TypeVariable']
  ],
  MethodBody: [
     ['Block'],
     [literal(';')]
  ],
  InstanceInitializer: [
     ['Block']
  ],
  StaticInitializer: [
     [literal('static'), 'Block']
  ],
  ConstructorDeclaration: [
     [multiple('ConstructorModifier'),
              'ConstructorDeclarator',
              optional('Throws'),
              'ConstructorBody']
  ],
  ConstructorModifier: [
     ['Annotation'],
     [literal('public')],
     [literal('protected')],
     [literal('private')]
  ],
  ConstructorDeclarator: [
     [optional('TypeParameters'),
              'SimpleTypeName',
              literal('('), optional('FormalParameterList'), literal(')')]
  ],
  SimpleTypeName: [
     ['Identifier']
  ],
  ConstructorBody: [
     [literal('{'),
              optional('ExplicitConstructorInvocation'),
              optional('BlockStatements'),
              literal('}')]
  ],
  ExplicitConstructorInvocation: [
     [optional('TypeArguments'), literal('this'), literal('('), optional('ArgumentList'), literal(')'), literal(';')],
     [optional('TypeArguments'), literal('super'), literal('('), optional('ArgumentList'), literal(')'), literal(';')],
     ['ExpressionName', literal('.'), optional('TypeArguments'), literal('super'), literal('('), optional('ArgumentList'), literal(')'), literal(';')],
     ['Primary', literal('.'), optional('TypeArguments'), literal('super'), literal('('), optional('ArgumentList'), literal(')'), literal(';')]
  ],
  EnumDeclaration: [
     [multiple('ClassModifier'),
              literal('enum'), 'Identifier',
              optional('Superinterfaces'),
              'EnumBody']
  ],
  EnumBody: [
     [literal('{'),
              optional('EnumConstantList'), optional(literal(',')),
              optional('EnumBodyDeclarations'),
              literal('}')]
  ],
  EnumConstantList: [
     ['EnumConstant', multiple(literal(','), 'EnumConstant')]
  ],
  EnumConstant: [
     [multiple('EnumConstantModifier'),
              'Identifier',
              optional(literal('('), 'ArgumentList', literal(')')),
              optional('ClassBody')]
  ],
  EnumConstantModifier: [
     ['Annotation']
  ],
  EnumBodyDeclarations: [
     [literal(';'), multiple('ClassBodyDeclaration')]
  ],
  InterfaceDeclaration: [
     ['NormalInterfaceDeclaration'],
     ['AnnotationTypeDeclaration']
  ],
  NormalInterfaceDeclaration: [
     [multiple('InterfaceModifier'), 
              literal('interface'), 'Identifier',
              optional('TypeParameters'),
              optional('ExtendsInterfaces'),
              'InterfaceBody']
  ],
  InterfaceModifier: [
     ['Annotation'],
     [literal('public')],
     [literal('protected')],
     [literal('private')],
     [literal('abstract')],
     [literal('static')],
     [literal('strictfp')]
  ],
  ExtendsInterfaces: [
     [literal('extends'), 'InterfaceTypeList']
  ],
  InterfaceBody: [
     [literal('{'), multiple('InterfaceMemberDeclaration'), literal('}')]
  ],
  InterfaceMemberDeclaration: [
     ['ConstantDeclaration'],
     ['InterfaceMethodDeclaration'],
     ['ClassDeclaration'],
     ['InterfaceDeclaration'],
     [literal(';')]
  ],
  ConstantDeclaration: [
     [multiple('ConstantModifier'),
              'UnannType',
              'VariableDeclaratorList', literal(';')]
  ],
  ConstantModifier: [
     ['Annotation'],
     [literal('public')],
     [literal('static')],
     [literal('final')]
  ],
  InterfaceMethodDeclaration: [
     [multiple('InterfaceMethodModifier'),
              'MethodHeader',
              'MethodBody']
  ],
  InterfaceMethodModifier: [
     ['Annotation'],
     [literal('public')],
     [literal('private')],
     [literal('abstract')],
     [literal('default')],
     [literal('static')],
     [literal('strictfp')]
  ],
  AnnotationTypeDeclaration: [
     [multiple('InterfaceModifier'),
              literal('@'), literal('interface'), 'Identifier',
              'AnnotationTypeBody']
  ],
  AnnotationTypeBody: [
     [literal('{'),
              multiple('AnnotationTypeMemberDeclaration'),
              literal('}')]
  ],
  AnnotationTypeMemberDeclaration: [
     ['AnnotationTypeElementDeclaration'],
     ['ConstantDeclaration'],
     ['ClassDeclaration'],
     ['InterfaceDeclaration'],
     [literal(';')]
  ],
  AnnotationTypeElementDeclaration: [
     [multiple('AnnotationTypeElementModifier'),
              'UnannType', 'Identifier', 
              literal('('), literal(')'), optional('Dims'),
              
              optional('DefaultValue'), literal(';')]
  ],
  AnnotationTypeElementModifier: [
     ['Annotation'],
     [literal('public')],
     [literal('abstract')]
  ],
  DefaultValue: [
     [literal('default'), 'ElementValue']
  ],
  Annotation: [
     ['NormalAnnotation'],
     ['MarkerAnnotation'],
     ['SingleElementAnnotation']
  ],
  NormalAnnotation: [
     [literal('@'), 'TypeName',
              literal('('), optional('ElementValuePairList'), literal(')')]
  ],
  ElementValuePairList: [
     ['ElementValuePair', multiple(literal(','), 'ElementValuePair')]
  ],
  ElementValuePair: [
     ['Identifier', literal('='), 'ElementValue']
  ],
  ElementValue: [
     ['ConditionalExpression'],
     ['ElementValueArrayInitializer'],
     ['Annotation']
  ],
  ElementValueArrayInitializer: [
     [literal('{'), optional('ElementValueList'), optional(literal(',')), literal('}')]
  ],
  ElementValueList: [
     ['ElementValue', multiple(literal(','), 'ElementValue')]
  ],
  MarkerAnnotation: [
     [literal('@'), 'TypeName']
  ],
  SingleElementAnnotation: [
     [literal('@'), 'TypeName',
              literal('('), 'ElementValue', literal(')')]
  ],
  ArrayInitializer: [
     [literal('{'), optional('VariableInitializerList'), optional(literal(',')), literal('}')]
  ],
  VariableInitializerList: [
     ['VariableInitializer', multiple(literal(','), 'VariableInitializer')]
  ],
  Block: [
     [literal('{'), optional('BlockStatements'), literal('}')]
  ],
  BlockStatements: [
     ['BlockStatement', multiple('BlockStatement')]
  ],
  BlockStatement: [
     ['LocalVariableDeclarationStatement'],
     ['ClassDeclaration'],
     ['Statement']
  ],
  LocalVariableDeclarationStatement: [
     ['LocalVariableDeclaration', literal(';')]
  ],
  LocalVariableDeclaration: [
     [multiple('VariableModifier'),
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
     [literal(';')]
  ],
  LabeledStatement: [
     ['Identifier', literal(':'),
              'Statement']
  ],
  LabeledStatementNoShortIf: [
     ['Identifier', literal(':'),
              'StatementNoShortIf']
  ],
  ExpressionStatement: [
     ['StatementExpression', literal(';')]
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
     [literal('if'), literal('('), 'Expression', literal(')'),
              'Statement']
  ],
  IfThenElseStatement: [
     [literal('if'), literal('('), 'Expression', literal(')'),
              'StatementNoShortIf',
              literal('else'), 'Statement']
  ],
  IfThenElseStatementNoShortIf: [
     [literal('if'), literal('('), 'Expression', literal(')'),
              'StatementNoShortIf',
              literal('else'), 'StatementNoShortIf']
  ],
  AssertStatement: [
     [literal('assert'), 'Expression', literal(';')],
     [literal('assert'), 'Expression', literal(':'), 'Expression', literal(';')]
  ],
  SwitchStatement: [
     [literal('switch'), literal('('), 'Expression', literal(')'),
              'SwitchBlock']
  ],
  SwitchBlock: [
     [literal('{'),
              multiple('SwitchBlockStatementGroup'),
              multiple('SwitchLabel'),
              literal('}')]
  ],
  SwitchBlockStatementGroup: [
     ['SwitchLabels', 'BlockStatements']
  ],
  SwitchLabels: [
     ['SwitchLabel', multiple('SwitchLabel')]
  ],
  SwitchLabel: [
     [literal('case'), 'ConstantExpression', literal(':')],
     [literal('case'), 'EnumConstantName', literal(':')],
     [literal('default'), literal(':')]
  ],
  EnumConstantName: [
     ['Identifier']
  ],
  WhileStatement: [
     [literal('while'), literal('('), 'Expression', literal(')'),
              'Statement']
  ],
  WhileStatementNoShortIf: [
     [literal('while'), literal('('), 'Expression', literal(')'),
              'StatementNoShortIf']
  ],
  DoStatement: [
     [literal('do'), 'Statement', literal('while'),
              literal('('), 'Expression', literal(')'), literal(';')]
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
     [literal('for'), literal('('),
              optional('ForInit'), literal(';'),
              optional('Expression'), literal(';'),
              optional('ForUpdate'),
              literal(')'), 'Statement']
  ],
  BasicForStatementNoShortIf: [
     [literal('for'), literal('('),
              optional('ForInit'), literal(';'),
              optional('Expression'), literal(';'),
              optional('ForUpdate'),
              literal(')'), 'StatementNoShortIf']
  ],
  ForInit: [
     ['StatementExpressionList'],
     ['LocalVariableDeclaration']
  ],
  ForUpdate: [
     ['StatementExpressionList']
  ],
  StatementExpressionList: [
     ['StatementExpression', multiple(literal(','), 'StatementExpression')]
  ],
  EnhancedForStatement: [
     [literal('for'), literal('('), 
              multiple('VariableModifier'),
              'UnannType', 
              'VariableDeclaratorId', 
              
              literal(':'), 'Expression',
              literal(')'),
              
              'Statement']
  ],
  EnhancedForStatementNoShortIf: [
     [literal('for'), literal('('), 
              multiple('VariableModifier'),
              'UnannType', 
              'VariableDeclaratorId',
              
              literal(':'), 'Expression',
              literal(')'),
              
              'StatementNoShortIf']
  ],
  BreakStatement: [
     [literal('break'), optional('Identifier'), literal(';')]
  ],
  ContinueStatement: [
     [literal('continue'), optional('Identifier'), literal(';')]
  ],
  ReturnStatement: [
     [literal('return'), optional('Expression'), literal(';')]
  ],
  ThrowStatement: [
     [literal('throw'), 'Expression', literal(';')]
  ],
  SynchronizedStatement: [
     [literal('synchronized'),
              literal('('), 'Expression', literal(')'),
              'Block']
  ],
  TryStatement: [
     [literal('try'), 'Block', 'Catches'],
     [literal('try'), 'Block', optional('Catches'), 'Finally'],
     ['TryWithResourcesStatement']
  ],
  Catches: [
     ['CatchClause', multiple('CatchClause')]
  ],
  CatchClause: [
     [literal('catch'),
              literal('('), 'CatchFormalParameter', literal(')'),
              'Block']
  ],
  CatchFormalParameter: [
     [multiple('VariableModifier'),
              'CatchType',
              'VariableDeclaratorId']
  ],
  CatchType: [
     ['UnannClassType',
              multiple(literal('|'), 'ClassType')]
  ],
  Finally: [
     [literal('finally'), 'Block']
  ],
  TryWithResourcesStatement: [
     [literal('try'),
              'ResourceSpecification',
              'Block',
              optional('Catches'),
              optional('Finally')]
  ],
  ResourceSpecification: [
     [literal('('), 'ResourceList', optional(literal(';')), literal(')')]
  ],
  ResourceList: [
     ['Resource', multiple(literal(';'), 'Resource')]
  ],
  Resource: [
     [multiple('VariableModifier'),
              'UnannType',
              'VariableDeclaratorId',
              literal('='), 'Expression'],
     ['VariableAccess']
  ],
  Primary: [
     ['PrimaryNoNewArray'],
     ['ArrayCreationExpression']
  ],
  PrimaryNoNewArray: [
     ['Literal'],
     ['ClassLiteral'],
     [literal('this')],
     ['TypeName', literal('.'), literal('this')],
     [literal('('), 'Expression', literal(')')],
     ['ClassInstanceCreationExpression'],
     ['FieldAccess'],
     ['ArrayAccess'],
     ['MethodInvocation'],
     ['MethodReference']
  ],
  ClassLiteral: [
     ['TypeName', multiple(literal('['), literal(']')), literal('.'), literal('class')],
     ['NumericType', multiple(literal('['), literal(']')), literal('.'), literal('class')],
     [literal('boolean'), multiple(literal('['), literal(']')), literal('.'), literal('class')],
     [literal('void'), literal('.'), literal('class')]
  ],
  ClassInstanceCreationExpression: [
     [
              
              'UnqualifiedClassInstanceCreationExpression'],
     ['ExpressionName', literal('.'), 'UnqualifiedClassInstanceCreationExpression'],
     ['Primary', literal('.'), 'UnqualifiedClassInstanceCreationExpression']
  ],
  UnqualifiedClassInstanceCreationExpression: [
     [literal('new'), optional('TypeArguments'),
              
              'ClassOrInterfaceTypeToInstantiate',
              literal('('), optional('ArgumentList'), literal(')'), optional('ClassBody')]
  ],
  ClassOrInterfaceTypeToInstantiate: [
     [multiple('Annotation'), 'Identifier',
              multiple(literal('.'), multiple('Annotation'), 'Identifier',),
              optional('TypeArgumentsOrDiamond')]
  ],
  TypeArgumentsOrDiamond: [
     ['TypeArguments'],
     [literal('&lt;&gt;')]
  ],
  FieldAccess: [
     ['Primary', literal('.'), 'Identifier'],
     [literal('super'), literal('.'), 'Identifier'],
     ['TypeName', literal('.'), literal('super'), literal('.'), 'Identifier']
  ],
  ArrayAccess: [
     ['ExpressionName', literal('['), 'Expression', literal(']')],
     ['PrimaryNoNewArray', literal('['), 'Expression', literal(']')]
  ],
  MethodInvocation: [
     [
              
              'MethodName', literal('('), optional('ArgumentList'), literal(')')],
     ['TypeName', literal('.'), optional('TypeArguments'), 'Identifier',
              literal('('), optional('ArgumentList'), literal(')')],
     ['ExpressionName', literal('.'), optional('TypeArguments'), 'Identifier',
              literal('('), optional('ArgumentList'), literal(')')],
     ['Primary', literal('.'), optional('TypeArguments'), 'Identifier',
              literal('('), optional('ArgumentList'), literal(')')],
     [literal('super'), literal('.'), optional('TypeArguments'), 'Identifier',
              literal('('), optional('ArgumentList'), literal(')')],
     ['TypeName', literal('.'), literal('super'), literal('.'), optional('TypeArguments'), 'Identifier',
              literal('('), optional('ArgumentList'), literal(')')]
  ],
  ArgumentList: [
     ['Expression', multiple(literal(','), 'Expression')]
  ],
  MethodReference: [
     [
              
              'ExpressionName', literal('::'),
              optional('TypeArguments'), 'Identifier'],
     ['Primary', literal('::'),
              optional('TypeArguments'), 'Identifier'],
     ['ReferenceType', literal('::'),
              optional('TypeArguments'), 'Identifier'],
     [literal('super'), literal('::'),
              optional('TypeArguments'), 'Identifier'],
     ['TypeName', literal('.'), literal('super'), literal('::'),
              optional('TypeArguments'), 'Identifier'],
     ['ClassType', literal('::'),
              optional('TypeArguments'), literal('new')],
     ['ArrayType', literal('::'), literal('new')]
  ],
  ArrayCreationExpression: [
     [literal('new'), 'PrimitiveType', 'DimExprs', optional('Dims')],
     [literal('new'), 'ClassOrInterfaceType', 'DimExprs', optional('Dims')],
     [literal('new'), 'PrimitiveType', 'Dims', 'ArrayInitializer'],
     [literal('new'), 'ClassOrInterfaceType', 'Dims', 'ArrayInitializer']
  ],
  DimExprs: [
     ['DimExpr', multiple('DimExpr')]
  ],
  DimExpr: [
     [multiple('Annotation'), literal('['), 'Expression', literal(']')]
  ],
  Expression: [
     ['LambdaExpression'],
     ['AssignmentExpression']
  ],
  LambdaExpression: [
     ['LambdaParameters', literal('-&gt;'), 'LambdaBody']
  ],
  LambdaParameters: [
     ['Identifier'],
     [literal('('), optional('FormalParameterList'), literal(')')],
     [literal('('), 'InferredFormalParameterList', literal(')')]
  ],
  InferredFormalParameterList: [
     ['Identifier', multiple(literal(','), 'Identifier')]
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
     [literal('=')],
     [literal('*=')],
     [literal('/=')],
     [literal('%=')],
     [literal('+=')],
     [literal('-=')],
     [literal('&lt;&lt;=')],
     [literal('&gt;&gt;=')],
     [literal('&gt;&gt;&gt;=')],
     [literal('&amp;=')],
     [literal('^=')],
     [literal('|='),
            ]
  ],
  ConditionalExpression: [
     ['ConditionalOrExpression'],
     ['ConditionalOrExpression', literal('?'), 
              'Expression', literal(':'), 
              'ConditionalExpression'],
      ['ConditionalOrExpression', literal('?'), 
              'Expression', literal(':'), 
              'LambdaExpression']
  ],
  ConditionalOrExpression: [
     ['ConditionalAndExpression'],
     ['ConditionalOrExpression', literal('||'), 'ConditionalAndExpression']
  ],
  ConditionalAndExpression: [
     ['InclusiveOrExpression'],
     ['ConditionalAndExpression', literal('&amp;&amp;'), 'InclusiveOrExpression']
  ],
  InclusiveOrExpression: [
     ['ExclusiveOrExpression'],
     ['InclusiveOrExpression', literal('|'), 'ExclusiveOrExpression']
  ],
  ExclusiveOrExpression: [
     ['AndExpression'],
     ['ExclusiveOrExpression', literal('^'), 'AndExpression']
  ],
  AndExpression: [
     ['EqualityExpression'],
     ['AndExpression', literal('&amp;'), 'EqualityExpression']
  ],
  EqualityExpression: [
     ['RelationalExpression'],
     ['EqualityExpression', literal('=='), 'RelationalExpression'],
     ['EqualityExpression', literal('!='), 'RelationalExpression']
  ],
  RelationalExpression: [
     ['ShiftExpression'],
     ['RelationalExpression', literal('&lt;'), 'ShiftExpression'],
     ['RelationalExpression', literal('&gt;'), 'ShiftExpression'],
     ['RelationalExpression', literal('&lt;='), 'ShiftExpression'],
     ['RelationalExpression', literal('&gt;='), 'ShiftExpression'],
     ['RelationalExpression', literal('instanceof'), 'ReferenceType']
  ],
  ShiftExpression: [
     ['AdditiveExpression'],
     ['ShiftExpression', literal('&lt;&lt;'), 'AdditiveExpression'],
     ['ShiftExpression', literal('&gt;&gt;'), 'AdditiveExpression'],
     ['ShiftExpression', literal('&gt;&gt;&gt;'), 'AdditiveExpression']
  ],
  AdditiveExpression: [
     ['MultiplicativeExpression'],
     ['AdditiveExpression', literal('+'), 'MultiplicativeExpression'],
     ['AdditiveExpression', literal('-'), 'MultiplicativeExpression']
  ],
  MultiplicativeExpression: [
     ['UnaryExpression'],
     ['MultiplicativeExpression', literal('*'), 'UnaryExpression'],
     ['MultiplicativeExpression', literal('/'), 'UnaryExpression'],
     ['MultiplicativeExpression', literal('%'), 'UnaryExpression']
  ],
  UnaryExpression: [
     ['UnaryExpressionNotPlusMinus'],
     ['PreIncrementExpression'],
     ['PreDecrementExpression'],
     [literal('+'), 'UnaryExpression'],
     [literal('-'), 'UnaryExpression']
  ],
  PreIncrementExpression: [
     [literal('++'), 'UnaryExpression']
  ],
  PreDecrementExpression: [
     [literal('--'), 'UnaryExpression']
  ],
  UnaryExpressionNotPlusMinus: [
     ['PostfixExpression'],
     [literal('~'), 'UnaryExpression'],
     [literal('!'), 'UnaryExpression'],
     ['CastExpression']
  ],
  PostfixExpression: [
     ['Primary'],
     ['ExpressionName'],
     ['PostIncrementExpression'],
     ['PostDecrementExpression']
  ],
  PostIncrementExpression: [
     ['PostfixExpression', literal('++')]
  ],
  PostDecrementExpression: [
     ['PostfixExpression', literal('--')]
  ],
  CastExpression: [
     [literal('('), 'PrimitiveType', literal(')'),
              'UnaryExpression'],
     [literal('('), 'ReferenceType', multiple('AdditionalBound'), literal(')'),
              'UnaryExpressionNotPlusMinus'],
     [literal('('), 'ReferenceType', multiple('AdditionalBound'), literal(')'),
              'LambdaExpression']
  ],
  ConstantExpression: [
     ['Expression']
  ]
};

console.log("Done.");

$(() => {
  let startElem = findSymbol('Statement').renderWithTreeNode();
  $('.workspace').empty().append(startElem);
  $('.tree').empty().append(GrammarNode.treeNodeFor(startElem));
});
