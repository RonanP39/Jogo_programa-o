import { useState } from "react";

const AM="#EF9F27",AL="rgba(239,159,39,0.1)",AB="rgba(239,159,39,0.22)";
const TX="#e0d4b4",MT="rgba(224,212,180,0.45)",BG="#1a1810",SF="#22201a",CB="#110f08";
const GN="#5DCAA5",CR="#D85A30";

const SCENES = [
  { id:"taverna", ch:"Capítulo 1", title:"A Taverna da Memória", icon:"ti-home",
    narr:`Você é Byte, jovem aprendiz no Reino do Código — onde feitiços de lógica movem montanhas e encantamentos de dados constroem cidades.\n\nSua missão: restaurar os sistemas do Grande Oráculo.\n\nA taverneira Varinha te recebe com um enorme livro:\n\n— Para registrar sua presença, como prefere que eu anote seu nome?`,
    narrH:`Taverna da Memória. Varinha precisa registrar seu nome. Como prefere?`,
    hint:"Variáveis armazenam valores com um nome — como caixas com etiqueta.",
    item:{icon:"ti-book",name:"Grande Registro"},
    concept:{name:"Variáveis",cl:"#378ADD",bg:"rgba(55,138,221,0.07)",bd:"rgba(55,138,221,0.22)",
      sum:"Uma variável é uma caixa nomeada que guarda um valor. Você cria quantas precisar e acessa o valor pelo nome a qualquer momento do programa.",
      py:`nome = "Byte"\nnivel = 1\nvida = 100\n\n# Acessando:\nprint(nome)   # → "Byte"\nprint(nivel)  # → 1`,
      js:`let nome = "Byte";\nlet nivel = 1;\nlet vida = 100;\n\n// Acessando:\nconsole.log(nome);   // → "Byte"\nconsole.log(nivel);  // → 1`},
    choices:[
      {text:'Registrar formalmente: nome = "Byte"',good:true,cons:`Varinha escreve no Grande Registro: nome = "Byte".\n\n— Perfeito! Você criou uma VARIÁVEL — uma caixa com etiqueta. Etiqueta: 'nome'. Conteúdo: 'Byte'. Sempre que precisar, é só consultar a caixa 'nome'.`},
      {text:"Anotar em um guardanapo qualquer",good:false,cons:`O guardanapo voa pela janela com o vento.\n\n— Seu nome se perdeu! Sem uma VARIÁVEL para guardá-lo, a informação desapareceu no nada.`,branch:`Varinha pega um novo livro e registra corretamente: nome = "Byte".\n\n— Veja: a etiqueta 'nome' aponta sempre para 'Byte'. É assim que variáveis funcionam — o nome é permanente, o valor pode mudar.`}],
    quiz:{q:"Qual é a melhor definição de variável?",opts:["Uma caixa nomeada que guarda um valor","Uma lista de instruções para executar","Um tipo especial de número"],ok:0}},

  { id:"encruzilhada", ch:"Capítulo 2", title:"A Encruzilhada das Decisões", icon:"ti-git-branch",
    narr:`Com o registro em mãos, você segue pelo Caminho do Compilador. Uma encruzilhada surge à frente — dois caminhos, um guarda imponente no meio.\n\n— Alto! Só passa quem tem o Cristal de Acesso.\n\nVocê lembra vagamente que Varinha te entregou algo brilhante ao sair da taverna. Como agir?`,
    narrH:`Encruzilhada. Guarda exige o Cristal de Acesso. O que você faz?`,
    hint:"Sempre verifique a condição antes de agir — use if/else para decidir.",
    item:{icon:"ti-diamond",name:"Cristal de Acesso"},
    concept:{name:"Condicionais",cl:"#1D9E75",bg:"rgba(29,158,117,0.07)",bd:"rgba(29,158,117,0.22)",
      sum:"Condicionais permitem que o código tome decisões: SE uma condição for verdadeira, execute A; SENÃO, execute B. É a base de toda lógica de escolha.",
      py:`if tem_cristal:\n    passar_pela_guarda()\nelse:\n    procurar_outro_caminho()\n\n# Encadeando:\nif vida > 50:\n    atacar()\nelif vida > 20:\n    defender()\nelse:\n    fugir()`,
      js:`if (temCristal) {\n    passarPelaGuarda();\n} else {\n    procurarOutroCaminho();\n}\n\n// Encadeando:\nif (vida > 50) atacar();\nelse if (vida > 20) defender();\nelse fugir();`},
    choices:[
      {text:"Verificar o inventário antes de responder",good:true,cons:`SE tenho o cristal... SIM! Está aqui!\n\n— Tenho sim! O guarda se inclina respeitosamente.\n\n— Excelente! Você avaliou a condição antes de agir. Em código: if (tem_cristal): passar(). Condicionais são exatamente isso.`},
      {text:"Assumir que não tem e pedir ajuda",good:false,cons:`— Não tenho... acho. O guarda aponta para seu bolso, de onde o cristal já brilhava.\n\n— Você TINHA o tempo todo! Assumiu sem verificar a condição.`,branch:`O guarda ri gentilmente.\n\n— Em código, assumir sem testar gera bugs. if (tem_cristal) { passar() } teria verificado antes. Lembre: sempre teste, nunca assuma.`}],
    quiz:{q:"O que acontece quando a condição do 'if' é falsa e há um 'else'?",opts:["O programa encerra","O bloco 'else' é executado","A condição é testada novamente"],ok:1}},

  { id:"torre", ch:"Capítulo 3", title:"A Torre dos Loops", icon:"ti-refresh",
    narr:`Além da encruzilhada ergue-se uma Torre imensa — 100 degraus de pedra cinza. Um duende sorridente aguarda na base.\n\n— Para abrir a porta lá no topo, você deve colocar uma pedra mágica em cada degrau. Todas as 100.\n\nEle te entrega uma sacola cheia de pedras e pisca com um sorriso enigmático.`,
    narrH:`Torre de 100 degraus. Uma pedra em cada degrau. Como você resolve eficientemente?`,
    hint:"Para repetir a mesma ação muitas vezes, use uma estrutura de repetição — for ou while.",
    item:{icon:"ti-circles",name:"Pedra Mágica"},
    concept:{name:"Loops",cl:"#D85A30",bg:"rgba(216,90,48,0.07)",bd:"rgba(216,90,48,0.22)",
      sum:"Loops repetem automaticamente um bloco de código enquanto uma condição for verdadeira. Em vez de 100 linhas idênticas, você escreve uma vez.",
      py:`for degrau in range(1, 101):\n    colocar_pedra(degrau)\n\n# While loop:\ncontador = 0\nwhile contador < 100:\n    colocar_pedra(contador)\n    contador += 1`,
      js:`for (let d = 1; d <= 100; d++) {\n    colocarPedra(d);\n}\n\n// While loop:\nlet contador = 0;\nwhile (contador < 100) {\n    colocarPedra(contador);\n    contador++;\n}`},
    choices:[
      {text:"Criar um feitiço que se repete 100 vezes automaticamente",good:true,cons:`As pedras voam e se posicionam em perfeita ordem. Em segundos, pronto!\n\n— BRILHANTE! Você criou um LOOP! Descreveu o padrão UMA VEZ e a magia executou 100 vezes. Isso é eficiência pura.`},
      {text:"Subir e colocar cada pedra manualmente, uma a uma",good:false,cons:`Três horas depois, no degrau 67, seus joelhos protestam. No degrau 89 você escorrega.\n\n— Imagine 10.000 degraus! LOOPS existem para isso.`,branch:`O duende te ajuda a terminar com magia.\n\n— Veja: for degrau in range(100): colocar_pedra(degrau). Uma linha substitui 100 ações. Loops são o superpoder da eficiência.`}],
    quiz:{q:"Quantas vezes o loop 'for i in range(5)' executa?",opts:["4 vezes","5 vezes","6 vezes"],ok:1}},

  { id:"oficina", ch:"Capítulo 4", title:"A Oficina das Funções", icon:"ti-tool",
    narr:`No alto da torre há uma oficina iluminada. A mestre artesã te olha seriamente:\n\n— Preciso acender 50 tochas antes que os visitantes cheguem. Cada tocha: pegar o fósforo, riscar, aproximar da chama, soprar suavemente.\n\nComo vai se organizar para não errar nenhuma etapa?`,
    narrH:`Oficina. 50 tochas. 4 passos cada. Como você organiza para não errar?`,
    hint:"Encapsule os passos em um bloco com nome que pode ser chamado repetidamente — isso é uma função.",
    item:{icon:"ti-flame",name:"Fogo Perpétuo"},
    concept:{name:"Funções",cl:"#7F77DD",bg:"rgba(127,119,221,0.07)",bd:"rgba(127,119,221,0.22)",
      sum:"Uma função é um bloco de código com nome que encapsula uma sequência de passos. Escreva uma vez, execute quantas vezes quiser — sem repetição, sem erro.",
      py:`def acender_tocha():\n    pegar_fosforo()\n    riscar()\n    aproximar_chama()\n    soprar_suave()\n\n# Com parâmetro e retorno:\ndef saudar(nome):\n    return "Olá, " + nome\n\nsaudar("Byte")  # → "Olá, Byte"`,
      js:`function acenderTocha() {\n    pegarFosforo();\n    riscar();\n    aproximarChama();\n    soprarSuave();\n}\n\n// Com parâmetro e retorno:\nfunction saudar(nome) {\n    return "Olá, " + nome;\n}\nsaudar("Byte"); // → "Olá, Byte"`},
    choices:[
      {text:"Criar um feitiço reutilizável: acender_tocha()",good:true,cons:`Você define o feitiço com 4 passos e o invoca 50 vezes — cada tocha acende com precisão perfeita.\n\n— MAGNÍFICO! Você criou uma FUNÇÃO! Escreva uma vez, use para sempre. Se um passo mudar, corrija em UM lugar.`},
      {text:"Memorizar os 4 passos e repetir mentalmente para cada tocha",good:false,cons:`Na tocha 23 você erra a ordem. Na tocha 31 esquece o fósforo.\n\n— Uma FUNÇÃO teria guardado a sequência perfeita e impecável!`,branch:`A artesã reacende as tochas erradas.\n\n— Veja: def acender_tocha(): [passos]. Uma vez definida, acender_tocha() é impecável toda vez. Funções eliminam o erro humano da repetição.`}],
    quiz:{q:"Qual é a principal vantagem de usar funções?",opts:["Executam mais rápido que código normal","Evitam repetição e facilitam manutenção","Só funcionam com números"],ok:1}},

  { id:"mercado", ch:"Capítulo 5", title:"O Mercado das Listas", icon:"ti-list",
    narr:`Descendo ao vilarejo, você para no Mercado das Maravilhas. O mercador empilha itens:\n\nEspada. Escudo. Poção de cura. Mapa. Bússola. Lanterna. Corda. Pederneira. Cantil. Pergaminho.\n\n— Dez itens! Como vai organizar tudo isso na sua memória mágica?`,
    narrH:`Mercado. 10 itens para comprar. Como você os organiza na memória?`,
    hint:"Quando há muitos valores relacionados, um array (lista) os agrupa sob um único nome com índices.",
    item:{icon:"ti-backpack",name:"Bolsa Mágica"},
    concept:{name:"Arrays",cl:"#BA7517",bg:"rgba(186,117,23,0.07)",bd:"rgba(186,117,23,0.22)",
      sum:"Um array (lista) é uma coleção ordenada de valores sob um único nome. Itens são acessados pela posição (índice), começando em 0.",
      py:`suprimentos = [\n    "espada", "escudo", "poção",\n    "mapa", "bússola", "lanterna"\n]\n\nsuprimentos[0]   # → "espada"\nsuprimentos[-1]  # → "lanterna"\nlen(suprimentos) # → 6\nsuprimentos.append("corda")`,
      js:`const suprimentos = [\n    "espada", "escudo", "poção",\n    "mapa", "bússola", "lanterna"\n];\n\nsuprimentos[0];       // → "espada"\nsuprimentos.at(-1);   // → "lanterna"\nsuprimentos.length;   // → 6\nsuprimentos.push("corda");`},
    choices:[
      {text:'Colocar tudo em uma lista: suprimentos = [...]',good:true,cons:`Tudo ordenado! suprimentos[5] → "lanterna". len(suprimentos) → 10.\n\n— Um ARRAY perfeito! Valores agrupados sob um nome, acessados por índice. Organização e eficiência juntas.`},
      {text:"Criar uma variável separada para cada item (item1, item2...)",good:false,cons:`Uma semana depois, você não lembra se item7 era a corda ou a pederneira. Com 10 itens! Imagine 10.000?\n\n— ARRAYS agrupam dados relacionados com posições indexadas.`,branch:`O mercador reorganiza tudo numa lista.\n\n— Veja: suprimentos[0] é sempre "espada". Previsível, organizado. Variáveis avulsas não escalam além de alguns itens.`}],
    quiz:{q:"Qual é o índice do PRIMEIRO elemento de um array?",opts:["1","0","-1"],ok:1}},

  { id:"castelo", ch:"Capítulo 6", title:"O Castelo dos Objetos", icon:"ti-crown",
    narr:`O Castelo do Código se ergue diante de você. O porteiro, um gnomo meticuloso, consulta seu livro:\n\n— Para entrar, preciso do seu perfil completo: nome, nível, classe e pontos de vida. Quatro informações sobre a mesma entidade — você.\n\nComo vai organizar esses dados?`,
    narrH:`Porteiro exige seu perfil completo: nome, nível, classe, vida. Como organizar?`,
    hint:"Dados que pertencem à mesma entidade ficam melhor agrupados em um objeto — como uma ficha de personagem.",
    item:{icon:"ti-shield",name:"Brasão do Castelo"},
    concept:{name:"Objetos",cl:"#1D9E75",bg:"rgba(29,158,117,0.07)",bd:"rgba(29,158,117,0.22)",
      sum:"Um objeto agrupa dados relacionados (propriedades) sob uma entidade única. Modela o mundo real: um herói tem nome, nível, vida. Acesse com objeto['chave'] ou objeto.chave.",
      py:`heroi = {\n    "nome": "Byte",\n    "nivel": 6,\n    "classe": "Desenvolvedor",\n    "vida": 100\n}\n\nheroi["nome"]  # → "Byte"\nheroi["vida"]  # → 100\nheroi["nivel"] = 7  # atualizar`,
      js:`const heroi = {\n    nome: "Byte",\n    nivel: 6,\n    classe: "Desenvolvedor",\n    vida: 100\n};\n\nheroi.nome;       // → "Byte"\nheroi["vida"];    // → 100\nheroi.nivel = 7;  // atualizar`},
    choices:[
      {text:'Criar um objeto "herói" com todas as propriedades',good:true,cons:`heroi = { nome: "Byte", nivel: 6... } — o porteiro escaneia e sorri.\n\n— EXCELENTE! Um OBJETO! Todas as informações da mesma entidade agrupadas. heroi.nome, heroi.vida — acessível e organizado.`},
      {text:"Usar variáveis separadas: nome, nivel, classe, vida",good:false,cons:`O porteiro mistura seus dados com os de outros heróis. 'vida' conflita com a vida do porteiro. 'nivel' some no caos.\n\n— OBJETOS agrupam dados que pertencem juntos!`,branch:`O porteiro refaz o registro.\n\n— Veja: heroi.vida é inequívoco. 'vida' solta no contexto global colide com outras variáveis. Objetos criam um espaço próprio para cada entidade.`}],
    quiz:{q:"Como você acessa a propriedade 'nome' de um objeto chamado 'heroi'?",opts:["heroi[nome]","heroi.nome ou heroi['nome']","nome.heroi"],ok:1}},

  { id:"oraculo", ch:"Capítulo 7", title:"O Oráculo do Debug", icon:"ti-bug",
    narr:`Você entra no salão do Grande Oráculo — um ser de luz pulsante. Mas algo está errado.\n\nTelas piscam em vermelho. Alarmes soam. O Oráculo aponta para uma mensagem:\n\n    NameError: 'cristal_de_aceso' não definido — linha 42\n\n— Os sistemas estão falhando por causa desse bug. Você consegue corrigir?`,
    narrH:`NameError: 'cristal_de_aceso' não definido — linha 42. O sistema falha. O que você faz?`,
    hint:"Leia a mensagem de erro com atenção — ela diz O QUÊ falhou e em qual linha.",
    item:{icon:"ti-zoom-in",name:"Lupa do Debug"},
    concept:{name:"Debugging",cl:"#E24B4A",bg:"rgba(226,75,74,0.07)",bd:"rgba(226,75,74,0.22)",
      sum:"Debugging é o processo de encontrar e corrigir erros (bugs). Leia a mensagem de erro — ela diz O QUÊ falhou e ONDE. Bugs são normais; saber debugar é essencial.",
      py:`# Erro original:\ncristal_de_aceso   # ← erro de digitação!\n\n# Correção:\ncristal_de_acesso  # ← uma letra faz diferença\n\n# Tipos de erros comuns:\n# SyntaxError   → código malformado\n# NameError     → variável não definida\n# TypeError     → tipo errado`,
      js:`// Erro original:\ncristalDeAceso;    // ← erro de digitação!\n\n// Correção:\ncristalDeAcesso;   // ← uma letra faz diferença\n\n// Tipos de erros comuns:\n// SyntaxError    → código malformado\n// ReferenceError → variável não definida\n// TypeError      → tipo errado`},
    choices:[
      {text:"Ler a mensagem de erro e rastrear a causa",good:true,cons:`'cristal_de_aceso' → cristal_de_ACEssO! Um 's' faltando na linha 42.\n\nVocê corrige. Os sistemas voltam ao normal. As telas ficam verdes!\n\n— FANTÁSTICO! Você debugou! Um único caractere pode derrubar um sistema. Sempre leia as mensagens de erro.`},
      {text:"Reescrever tudo do zero com medo do erro",good:false,cons:`Você recomeça e replica o mesmo erro de digitação. O sistema continua falhando.\n\n— Bugs não somem com pânico! Debugging é metodológico: leia, localize, corrija.`,branch:`O Oráculo te guia pela mensagem.\n\n— 'cristal_de_aceso'. Agora compare com o nome correto. Um 's' a menos. Cirurgia precisa, não demolição. É assim que se debuga.`}],
    quiz:{q:"O que um 'NameError' geralmente indica?",opts:["Erro de sintaxe no código","Uma variável foi usada sem ser definida","Divisão por zero"],ok:1}},

  { id:"biblioteca", ch:"Capítulo 8", title:"A Biblioteca dos Textos", icon:"ti-book",
    narr:`Na saída do castelo, você descobre uma vasta biblioteca. A fada escriba te chama:\n\n— Preciso criar um índice único para cada pergaminho, unindo título com número de série. Por exemplo:\n\n    "A Lenda" + " #" + "42"\n\nComo você manipularia esse texto?`,
    narrH:`Biblioteca. Concatenar: "A Lenda" + " #" + "42". Como você faz?`,
    hint:"Strings podem ser unidas com o operador + — isso se chama concatenação de texto.",
    item:{icon:"ti-scroll",name:"Pergaminho Antigo"},
    concept:{name:"Strings",cl:"#D4537E",bg:"rgba(212,83,126,0.07)",bd:"rgba(212,83,126,0.22)",
      sum:"Strings são sequências de caracteres (texto). Você pode concatenar, fatiar, buscar e transformar strings. São um dos tipos de dados mais usados.",
      py:`titulo = "A Lenda"\nindice = titulo + " #42"\n# → "A Lenda #42"\n\n# Operações úteis:\ntitulo.upper()   # → "A LENDA"\nlen(titulo)      # → 7\ntitulo[0]        # → "A"\ntitulo.split(" ")  # → ["A", "Lenda"]`,
      js:`const titulo = "A Lenda";\nconst indice = titulo + " #42";\n// → "A Lenda #42"\n\n// Operações úteis:\ntitulo.toUpperCase();  // → "A LENDA"\ntitulo.length;         // → 7\ntitulo[0];             // → "A"\ntitulo.split(" ");     // → ["A", "Lenda"]`},
    choices:[
      {text:'Concatenar strings: "A Lenda" + " #" + "42"',good:true,cons:`O índice aparece: "A Lenda #42"!\n\n— PERFEITO! Você concatenou STRINGS! O operador + une pedaços de texto. Strings têm dezenas de operações: fatiar, buscar, transformar.`},
      {text:'Tentar somar como números: 42 + "A Lenda"',good:false,cons:`TypeError: não é possível somar número com texto diretamente!\n\n— Strings são texto, não números. Para converter: str(42) em Python, String(42) em JS.`,branch:`A fada explica a conversão de tipos.\n\n— Veja: str(42) transforma o número em texto antes de concatenar. "A Lenda #" + str(42) funciona perfeitamente. Tipos importam — sempre trate texto como texto.`}],
    quiz:{q:"O que 'texto'.upper() faz em Python?",opts:["Converte para maiúsculas","Remove espaços extras","Inverte o texto"],ok:0}},

  { id:"portal", ch:"Capítulo 9", title:"O Portal da Verdade", icon:"ti-toggle-right",
    narr:`Você chega a um Portal Mágico custodiado por dois guardiões: Verdade e Falsidade.\n\n— Para atravessar, você precisa entender que existem apenas dois estados possíveis no mundo — disse Verdade. — Tudo é VERDADEIRO ou FALSO. Nada mais.\n\nComo você representa esse conceito em código?`,
    narrH:`Portal da Verdade. Dois estados: verdadeiro ou falso. Como representar em código?`,
    hint:"Existe um tipo especial para valores que só podem ser verdadeiro ou falso — booleanos.",
    item:{icon:"ti-eye",name:"Olho da Verdade"},
    concept:{name:"Booleans",cl:"#534AB7",bg:"rgba(83,74,183,0.07)",bd:"rgba(83,74,183,0.22)",
      sum:"Booleanos são o tipo mais simples: True ou False. São o resultado de comparações e a base de toda lógica condicional em programação.",
      py:`ativo = True\nmorto = False\n\n# Comparações retornam booleano:\n5 > 3        # → True\n"a" == "b"   # → False\n\n# Operadores lógicos:\nTrue and False  # → False\nTrue or False   # → True\nnot True        # → False`,
      js:`let ativo = true;\nlet morto = false;\n\n// Comparações retornam booleano:\n5 > 3;          // → true\n"a" === "b";    // → false\n\n// Operadores lógicos:\ntrue && false;  // → false\ntrue || false;  // → true\n!true;          // → false`},
    choices:[
      {text:"Usar True/False: ativo = True, derrotado = False",good:true,cons:`Os guardiões se inclinam respeitosamente.\n\n— CORRETO! Booleans são o tipo mais simples: True ou False. Toda comparação (5 > 3 → True) retorna um booleano. São a fundação de toda lógica condicional.`},
      {text:'Usar texto: estado = "sim" ou estado = "não"',good:false,cons:`Os guardiões abanam a cabeça.\n\n— "SIM", "Sim", "sim" são três valores diferentes! Booleans True/False são universais e sem ambiguidade.`,branch:`O guardião demonstra o problema.\n\n— Se estado == "sim" — e alguém digita "Sim" com S maiúsculo: bug! Com True/False isso não acontece. Booleans são precisos e sem variações de capitalização.`}],
    quiz:{q:"O que a expressão '10 > 5' retorna?",opts:["10","True","5"],ok:1}},

  { id:"museu", ch:"Capítulo 10", title:"O Museu dos Valores", icon:"ti-flask",
    narr:`Você entra no Museu dos Valores — que cataloga todos os tipos de informação do reino.\n\nA curadora apresenta quatro alas:\n— Texto · Números · Booleans · Coleções\n\nUm aprendiz quer armazenar: nome, pontuação, se está ativo, e lista de itens.\n\nEm qual ala coloca cada informação?`,
    narrH:`Museu dos Tipos. Nome (texto), pontuação (número), ativo (sim/não), lista de itens. Qual tipo para cada?`,
    hint:"str para texto, int/float para números, bool para verdadeiro/falso, list para coleções.",
    item:{icon:"ti-flask",name:"Frasco de Tipos"},
    concept:{name:"Tipos de dados",cl:"#BA7517",bg:"rgba(186,117,23,0.07)",bd:"rgba(186,117,23,0.22)",
      sum:"Todo valor tem um tipo: str (texto), int/float (números), bool (verdadeiro/falso), list (listas). O tipo define o que você pode fazer com o valor.",
      py:`nome = "Byte"       # str\npontos = 42         # int\ntemp = 36.5         # float\nativo = True        # bool\nitens = ["espada"]  # list\n\n# Verificar e converter:\ntype(nome)     # → <class 'str'>\nint("42")      # → 42\nstr(100)       # → "100"\nfloat("3.14")  # → 3.14`,
      js:`const nome = "Byte";       // string\nconst pontos = 42;         // number\nconst temp = 36.5;         // number\nconst ativo = true;        // boolean\nconst itens = ["espada"];  // array\n\n// Verificar e converter:\ntypeof nome;    // → "string"\nNumber("42");   // → 42\nString(100);    // → "100"\nBoolean(0);     // → false`},
    choices:[
      {text:"Classificar: nome→str, pontos→int, ativo→bool, itens→list",good:true,cons:`A curadora registra tudo nas alas corretas.\n\n— EXCELENTE! Você conhece os TIPOS DE DADOS. Cada valor tem um tipo que define seu comportamento. Somar dois ints é matemática. Somar duas strs é concatenação.`},
      {text:'Colocar tudo como texto — é mais fácil',good:false,cons:`— "42" + "10" = "4210", não 52! Texto não faz matemática.\n\n— Usar o tipo errado cria bugs silenciosos e perigosos.`,branch:`A curadora demonstra o problema.\n\n— "42" + "10" resulta em "4210" (concatenação), não 52 (soma). O tipo define a operação. Sempre use str para texto, int para números inteiros.`}],
    quiz:{q:"Qual é o tipo do valor 3.14 em Python?",opts:["str","int","float"],ok:2}},

  { id:"espelho", ch:"Capítulo 11", title:"A Torre do Espelho", icon:"ti-infinity",
    narr:`Uma Torre estranha surge — repleta de espelhos que refletem espelhos. A feiticeira anciã te desafia:\n\n— Para subir, calcule os degraus de uma escada que dobra a cada andar. Andar 1: 1 degrau. Andar 2: 2. Andar N: o dobro do anterior.\n\nExiste uma solução elegante que usa a própria função dentro dela mesma.`,
    narrH:`Torre do Espelho. degraus(N) = degraus(N-1) × 2. Existe uma solução onde a função chama a si mesma?`,
    hint:"Uma função pode chamar a si mesma com um problema menor — isso se chama recursão.",
    item:{icon:"ti-infinity",name:"Espelho Recursivo"},
    concept:{name:"Recursão",cl:"#378ADD",bg:"rgba(55,138,221,0.07)",bd:"rgba(55,138,221,0.22)",
      sum:"Recursão é quando uma função chama a si mesma para resolver um problema menor. Toda recursão precisa de um caso base (parada) e um caso recursivo.",
      py:`def degraus(andar):\n    if andar == 1:        # caso base\n        return 1\n    return degraus(andar - 1) * 2  # recursivo\n\ndegraus(4)  # → 8\n# 1→1, 2→2, 3→4, 4→8\n\n# Clássico — fatorial:\ndef fat(n):\n    if n == 0: return 1\n    return n * fat(n - 1)`,
      js:`function degraus(andar) {\n    if (andar === 1) return 1; // caso base\n    return degraus(andar - 1) * 2; // recursivo\n}\n\ndegraus(4); // → 8\n\n// Clássico — fatorial:\nfunction fat(n) {\n    if (n === 0) return 1;\n    return n * fat(n - 1);\n}`},
    choices:[
      {text:"Criar uma função que chama a si mesma (recursão)",good:true,cons:`A escadaria se constrói sozinha, espelhando-se a cada andar!\n\n— EXTRAORDINÁRIO! Você usou RECURSÃO! Uma função que chama a si mesma com um problema menor. O segredo: o CASO BASE garante que a recursão para.`},
      {text:"Usar um loop multiplicando por 2 a cada iteração",good:false,cons:`Funciona perfeitamente! Mas a feiticeira sorri.\n\n— Correto, mas existe uma forma mais elegante. Recursão descreve o padrão matemático diretamente.`,branch:`A feiticeira mostra as duas abordagens.\n\n— Seu loop é eficaz. A recursão expressa: degraus(N) = degraus(N-1) * 2 — a própria definição matemática em código. Para problemas que se dividem em versões menores, recursão é natural.`}],
    quiz:{q:"O que é o 'caso base' em uma função recursiva?",opts:["O primeiro parâmetro da função","A condição que para a recursão","O valor retornado mais frequentemente"],ok:1}},

  { id:"armadilha", ch:"Capítulo 12", title:"A Câmara da Resiliência", icon:"ti-shield-check",
    narr:`Você chega à Câmara Final do Oráculo. O arcanista idoso te apresenta ao último desafio:\n\n— Os sistemas às vezes recebem entradas inválidas — números onde se espera texto, arquivos que não existem. Um bom desenvolvedor antecipa falhas.\n\nComo você protege o código de um erro inesperado sem travá-lo?`,
    narrH:`Câmara Final. Entradas inválidas causam erros. Como proteger o código sem travá-lo?`,
    hint:"Existe uma estrutura para 'tentar' executar algo e 'capturar' o erro se ele ocorrer.",
    item:{icon:"ti-shield-check",name:"Amuleto Protetor"},
    concept:{name:"Try / Except",cl:"#1D9E75",bg:"rgba(29,158,117,0.07)",bd:"rgba(29,158,117,0.22)",
      sum:"Try/Except (ou try/catch) protege o código de erros inesperados. 'Tente' executar algo; se falhar, 'capture' o erro e decida o que fazer — sem travar o programa.",
      py:`try:\n    numero = int(input("Digite um número: "))\n    resultado = 100 / numero\nexcept ValueError:\n    print("Isso não é um número!")\nexcept ZeroDivisionError:\n    print("Não divide por zero!")\nfinally:\n    print("Sempre executa")`,
      js:`try {\n    const n = parseInt(prompt("Digite um número:"));\n    const resultado = 100 / n;\n    console.log(resultado);\n} catch (erro) {\n    console.log("Erro:", erro.message);\n} finally {\n    console.log("Sempre executa");\n}`},
    choices:[
      {text:"Usar try/except para capturar e tratar o erro com elegância",good:true,cons:`Os sistemas absorvem a entrada inválida sem travar!\n\n— PERFEITO! TRY/EXCEPT é o escudo do programador. 'Tente' — se falhar, 'capture' e trate. O programa continua rodando mesmo diante do inesperado!`},
      {text:"Ignorar — erros são raros, provavelmente não vai acontecer",good:false,cons:`Na primeira entrada inválida, o sistema trava completamente.\n\n— Erros ACONTECEM. Sempre. TRY/EXCEPT existe para quando o inesperado ocorre — e sempre ocorre.`,branch:`O arcanista restaura o sistema.\n\n— Uma entrada inesperada derrubou tudo. Com try/except, o sistema capturaria o erro, mostraria uma mensagem amigável e continuaria rodando. Isso chama-se código resiliente.`}],
    quiz:{q:"O que o bloco 'finally' faz?",opts:["Só executa se houver erro","Executa sempre, com ou sem erro","Cancela o erro capturado"],ok:1}},
];

// ─── utilidades ───────────────────────────────────────────────
function NBtn({ children, onClick, disabled, variant = "amber" }) {
  const [h, sh] = useState(false);
  const clr = variant === "green" ? GN : AM;
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)}
      style={{ background: "transparent", border: `0.5px solid ${disabled ? AB : clr}`,
        color: disabled ? MT : clr, padding: "0.6rem 1.4rem",
        fontSize: "0.88rem", fontFamily: "Georgia, serif", cursor: disabled ? "default" : "pointer",
        borderRadius: "6px", opacity: h && !disabled ? 1 : 0.85, transition: "opacity 0.2s" }}>
      {children}
    </button>
  );
}

function CBtn({ children, onClick }) {
  const [h, sh] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)}
      style={{ background: h ? AL : "transparent", border: `0.5px solid ${h ? AM : AB}`,
        color: TX, padding: "0.85rem 1.2rem", textAlign: "left", cursor: "pointer",
        borderRadius: "8px", fontSize: "0.93rem", fontFamily: "Georgia, serif",
        lineHeight: 1.5, width: "100%", transition: "all 0.18s" }}>
      <i className="ti ti-arrow-right" style={{ fontSize: 14, marginRight: 8, color: AM, verticalAlign: "-1px" }} aria-hidden="true" />
      {children}
    </button>
  );
}

function ProgBar({ idx, total }) {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem" }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 99,
          background: i < idx ? AM : i === idx ? "rgba(239,159,39,0.4)" : "rgba(239,159,39,0.12)",
          transition: "background 0.5s" }} />
      ))}
    </div>
  );
}

function ScoreBadge({ score, max, difficulty }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem" }}>
      <span style={{ fontSize: 11, color: AM, letterSpacing: 1 }}>
        <i className="ti ti-star" style={{ fontSize: 12, marginRight: 4 }} aria-hidden="true" />
        {score} / {max} pts
      </span>
      <span style={{ fontSize: 10, background: AL, border: `0.5px solid ${AB}`, color: AM,
        padding: "2px 8px", borderRadius: 4, letterSpacing: 1 }}>
        {difficulty === "desafiador" ? "Desafiador" : "Iniciante"}
      </span>
    </div>
  );
}

function InventoryBar({ inventory }) {
  if (!inventory.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1rem" }}>
      {inventory.map((sc, i) => (
        <span key={i} title={sc.item.name} style={{ fontSize: 10, color: MT, background: SF,
          border: `0.5px solid ${AB}`, borderRadius: 4, padding: "2px 8px", display: "flex", alignItems: "center", gap: 4 }}>
          <i className={`ti ${sc.item.icon}`} style={{ fontSize: 12, color: AM }} aria-hidden="true" />
          {sc.item.name}
        </span>
      ))}
    </div>
  );
}

function GlossaryPanel({ learned, open, onToggle }) {
  return (
    <div style={{ borderTop: `0.5px solid ${AB}`, marginTop: "1.5rem" }}>
      <button onClick={onToggle}
        style={{ width: "100%", background: "transparent", border: "none", color: MT,
          padding: "0.75rem 0", cursor: "pointer", display: "flex", alignItems: "center",
          gap: 8, fontSize: 12, fontFamily: "Georgia, serif", letterSpacing: 1 }}>
        <i className="ti ti-book" style={{ fontSize: 14, color: AM }} aria-hidden="true" />
        Grimório do Desenvolvedor ({learned.length} conceitos)
        <i className={`ti ${open ? "ti-chevron-up" : "ti-chevron-down"}`}
          style={{ fontSize: 12, marginLeft: "auto" }} aria-hidden="true" />
      </button>
      {open && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8, paddingBottom: "1.5rem" }}>
          {learned.map((c, i) => (
            <div key={i} style={{ background: SF, border: `0.5px solid ${AB}`, borderRadius: 8, padding: "0.75rem" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: c.cl, marginBottom: 4 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: MT, lineHeight: 1.6 }}>{c.sum}</div>
            </div>
          ))}
          {!learned.length && <p style={{ fontSize: 13, color: MT, fontFamily: "Georgia, serif" }}>Complete capítulos para ver os conceitos aqui.</p>}
        </div>
      )}
    </div>
  );
}

// ─── telas principais ─────────────────────────────────────────
function Intro({ onStart, difficulty, setDifficulty }) {
  return (
    <div style={{ textAlign: "center", paddingTop: "2.5rem", paddingBottom: "1rem" }}>
      <i className="ti ti-sword" style={{ fontSize: 44, color: AM, display: "block", marginBottom: "1.25rem" }} aria-hidden="true" />
      <p style={{ fontSize: 10, letterSpacing: 4, color: AM, textTransform: "uppercase", marginBottom: "0.5rem" }}>Uma aventura de programação</p>
      <h1 style={{ fontSize: "2.2rem", fontWeight: "normal", color: "#f0e4c8", marginBottom: "1rem", letterSpacing: "1.5px", fontFamily: "Georgia, serif" }}>Terras do Código</h1>
      <p style={{ fontSize: "0.93rem", color: MT, maxWidth: 420, margin: "0 auto 2rem", lineHeight: 1.85, fontFamily: "Georgia, serif" }}>
        12 capítulos · 7 conceitos fundamentais + 5 avançados · pontuação · quiz · inventário
      </p>
      <p style={{ fontSize: 11, color: AM, letterSpacing: 2, textTransform: "uppercase", marginBottom: "0.75rem" }}>Escolha a dificuldade</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: "2rem" }}>
        {[["iniciante","ti-seedling","Mais contexto · dicas visíveis · aprendizado guiado"],
          ["desafiador","ti-flame","Menos contexto · dicas custam 2pts · para quem quer desafio"]].map(([d, ic, desc]) => (
          <button key={d} onClick={() => setDifficulty(d)}
            style={{ background: difficulty === d ? AL : "transparent",
              border: `0.5px solid ${difficulty === d ? AM : AB}`,
              color: difficulty === d ? AM : MT, padding: "1rem 1.25rem",
              borderRadius: 8, cursor: "pointer", fontFamily: "Georgia, serif",
              textAlign: "left", width: 200, transition: "all 0.2s" }}>
            <i className={`ti ${ic}`} style={{ fontSize: 18, display: "block", marginBottom: 8, color: difficulty === d ? AM : MT }} aria-hidden="true" />
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, textTransform: "capitalize" }}>{d}</div>
            <div style={{ fontSize: 11, lineHeight: 1.5, color: MT }}>{desc}</div>
          </button>
        ))}
      </div>
      <NBtn onClick={onStart} disabled={!difficulty}>Começar aventura →</NBtn>
    </div>
  );
}

function ChapterSelect({ scenes, inventory, onJump, onBack }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: MT, cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>
          <i className="ti ti-arrow-left" style={{ fontSize: 13, marginRight: 6 }} aria-hidden="true" />
          Voltar
        </button>
        <p style={{ fontSize: 10, letterSpacing: 3, color: AM, textTransform: "uppercase", margin: 0 }}>Selecionar capítulo</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
        {scenes.map((sc, i) => {
          const done = inventory.find(s => s.id === sc.id);
          return (
            <button key={i} onClick={() => onJump(i)}
              style={{ background: done ? AL : SF, border: `0.5px solid ${done ? AM : AB}`,
                borderRadius: 8, padding: "0.9rem", cursor: "pointer", textAlign: "left",
                fontFamily: "Georgia, serif", transition: "all 0.2s" }}>
              <i className={`ti ${sc.icon}`} style={{ fontSize: 16, color: AM, marginBottom: 8, display: "block" }} aria-hidden="true" />
              <div style={{ fontSize: 10, color: AM, letterSpacing: 2, marginBottom: 3 }}>{sc.ch}</div>
              <div style={{ fontSize: 12, color: TX, lineHeight: 1.4 }}>{sc.title}</div>
              {done && <div style={{ fontSize: 10, color: GN, marginTop: 6 }}>
                <i className="ti ti-check" style={{ fontSize: 10, marginRight: 4 }} aria-hidden="true" />concluído
              </div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Reading({ scene, difficulty, hintShown, onHint, onPick, hintCost }) {
  const narr = difficulty === "desafiador" ? scene.narrH : scene.narr;
  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ fontSize: 10, letterSpacing: 3, color: AM, textTransform: "uppercase", marginBottom: "0.3rem" }}>
          <i className={`ti ${scene.icon}`} style={{ fontSize: 13, marginRight: 6, verticalAlign: "-1px" }} aria-hidden="true" />
          {scene.ch}
        </p>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "normal", color: "#f0e4c8", margin: 0, fontFamily: "Georgia, serif" }}>{scene.title}</h2>
      </div>
      <div style={{ background: SF, border: `0.5px solid ${AB}`, borderRadius: 8, padding: "1.4rem 1.5rem", marginBottom: "1.25rem", lineHeight: 1.85, fontSize: "0.93rem", whiteSpace: "pre-line", color: TX, fontFamily: "Georgia, serif" }}>
        {narr}
      </div>
      {!hintShown ? (
        <button onClick={onHint}
          style={{ background: "transparent", border: `0.5px solid ${AB}`, color: MT,
            padding: "5px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12,
            fontFamily: "Georgia, serif", marginBottom: "1rem" }}>
          <i className="ti ti-bulb" style={{ fontSize: 12, marginRight: 6 }} aria-hidden="true" />
          {hintCost > 0 ? `Ver dica (−${hintCost} pts)` : "Ver dica (grátis)"}
        </button>
      ) : (
        <div style={{ background: "rgba(239,159,39,0.06)", border: `0.5px solid ${AB}`, borderRadius: 6, padding: "0.65rem 1rem", marginBottom: "1rem", fontSize: 12, color: AM, fontFamily: "Georgia, serif", lineHeight: 1.6 }}>
          <i className="ti ti-bulb" style={{ fontSize: 12, marginRight: 6 }} aria-hidden="true" />
          {scene.hint}
        </div>
      )}
      <p style={{ fontSize: 10, letterSpacing: 3, color: MT, textTransform: "uppercase", marginBottom: "0.65rem" }}>O que você faz?</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {scene.choices.map((c, i) => <CBtn key={i} onClick={() => onPick(i)}>{c.text}</CBtn>)}
      </div>
    </div>
  );
}

function Chosen({ choice, onContinue }) {
  const g = choice.good;
  const clr = g ? GN : CR;
  const cbg = g ? "rgba(93,202,165,0.07)" : "rgba(216,90,48,0.07)";
  const cbd = g ? "rgba(93,202,165,0.22)" : "rgba(216,90,48,0.22)";
  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: clr, background: cbg, border: `0.5px solid ${cbd}`, padding: "3px 10px", borderRadius: 4 }}>
          <i className={`ti ${g ? "ti-check" : "ti-alert-triangle"}`} style={{ fontSize: 12, marginRight: 5, verticalAlign: "-1px" }} aria-hidden="true" />
          {g ? `Boa escolha! +10 pts` : "Poderia ser melhor"}
        </span>
      </div>
      <div style={{ background: SF, border: `0.5px solid ${cbd}`, borderLeft: `3px solid ${clr}`, borderRadius: 8, padding: "1.4rem 1.5rem", marginBottom: "1.5rem", lineHeight: 1.85, fontSize: "0.93rem", whiteSpace: "pre-line", color: TX, fontFamily: "Georgia, serif" }}>
        {choice.cons}
      </div>
      <NBtn onClick={onContinue}>{choice.branch ? "Continuar história →" : "Ver conceito →"}</NBtn>
    </div>
  );
}

function BranchScene({ choice, onContinue }) {
  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: AM, background: AL, border: `0.5px solid ${AB}`, padding: "3px 10px", borderRadius: 4 }}>
          <i className="ti ti-rotate" style={{ fontSize: 12, marginRight: 5, verticalAlign: "-1px" }} aria-hidden="true" />
          Desvio narrativo
        </span>
      </div>
      <div style={{ background: SF, border: `0.5px solid ${AB}`, borderLeft: `3px solid ${AM}`, borderRadius: 8, padding: "1.4rem 1.5rem", marginBottom: "1.5rem", lineHeight: 1.85, fontSize: "0.93rem", whiteSpace: "pre-line", color: TX, fontFamily: "Georgia, serif" }}>
        {choice.branch}
      </div>
      <NBtn onClick={onContinue}>Ver conceito →</NBtn>
    </div>
  );
}

function ConceptCard({ scene, isLast, onNext }) {
  const c = scene.concept;
  const [lang, setLang] = useState("py");
  const [pyCode, setPy] = useState(c.py);
  const [jsCode, setJs] = useState(c.js);
  const curCode = lang === "py" ? pyCode : jsCode;
  const setCode = lang === "py" ? setPy : setJs;
  const origCode = lang === "py" ? c.py : c.js;
  return (
    <div>
      <div style={{ border: `0.5px solid ${c.bd}`, background: c.bg, borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: c.cl, marginBottom: "0.4rem" }}>
          <i className="ti ti-bulb" style={{ fontSize: 13, marginRight: 6, verticalAlign: "-1px" }} aria-hidden="true" />
          Conceito aprendido
        </p>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "normal", color: "#f0e4c8", marginBottom: "0.85rem", fontFamily: "Georgia, serif" }}>{c.name}</h3>
        <p style={{ fontSize: "0.9rem", color: TX, lineHeight: 1.78, marginBottom: "1.25rem", fontFamily: "Georgia, serif" }}>{c.sum}</p>
        <div style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
          {[["py","Python"],["js","JavaScript"]].map(([k,l]) => (
            <button key={k} onClick={() => setLang(k)}
              style={{ background: lang === k ? AL : "transparent", border: `0.5px solid ${lang === k ? AM : AB}`,
                color: lang === k ? AM : MT, padding: "3px 12px", borderRadius: 4, cursor: "pointer",
                fontSize: 11, fontFamily: "Georgia, serif", transition: "all 0.15s" }}>
              {l}
            </button>
          ))}
          <button onClick={() => setCode(origCode)}
            style={{ marginLeft: "auto", background: "transparent", border: `0.5px solid ${AB}`,
              color: MT, padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontSize: 10, fontFamily: "Georgia, serif" }}>
            <i className="ti ti-refresh" style={{ fontSize: 10, marginRight: 4 }} aria-hidden="true" />
            Resetar
          </button>
        </div>
        <textarea value={curCode} onChange={e => setCode(e.target.value)}
          style={{ width: "100%", background: CB, border: "0.5px solid rgba(239,159,39,0.1)",
            borderRadius: 6, padding: "0.9rem 1.1rem", fontFamily: "Courier New, monospace",
            fontSize: "0.8rem", color: "#b8dfa0", lineHeight: 1.78, resize: "vertical",
            minHeight: 130, boxSizing: "border-box", outline: "none" }} />
        <p style={{ fontSize: 11, color: MT, marginTop: 5, fontFamily: "Georgia, serif" }}>
          <i className="ti ti-pencil" style={{ fontSize: 10, marginRight: 4 }} aria-hidden="true" />
          Edite o código livremente para praticar!
        </p>
      </div>
      <NBtn onClick={onNext}>Fazer o quiz →</NBtn>
    </div>
  );
}

function Quiz({ scene, isLast, onSubmit }) {
  const [sel, setSel] = useState(null);
  const [rev, setRev] = useState(false);
  const q = scene.quiz;
  const correct = sel === q.ok;
  return (
    <div>
      <p style={{ fontSize: 10, letterSpacing: 3, color: AM, textTransform: "uppercase", marginBottom: "0.5rem" }}>
        <i className="ti ti-help-circle" style={{ fontSize: 13, marginRight: 6, verticalAlign: "-1px" }} aria-hidden="true" />
        Quiz rápido
      </p>
      <p style={{ fontSize: "0.97rem", color: TX, marginBottom: "1.25rem", fontFamily: "Georgia, serif", lineHeight: 1.7 }}>{q.q}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1rem" }}>
        {q.opts.map((opt, i) => {
          let bd = AB, bg2 = "transparent", tc = TX;
          if (rev) {
            if (i === q.ok) { bd = "rgba(93,202,165,0.5)"; bg2 = "rgba(93,202,165,0.08)"; tc = GN; }
            else if (i === sel) { bd = "rgba(216,90,48,0.5)"; bg2 = "rgba(216,90,48,0.08)"; tc = CR; }
          } else if (i === sel) { bd = AM; bg2 = AL; }
          return (
            <button key={i} onClick={() => !rev && setSel(i)}
              style={{ background: bg2, border: `0.5px solid ${bd}`, color: tc,
                padding: "0.75rem 1rem", textAlign: "left", cursor: rev ? "default" : "pointer",
                borderRadius: 8, fontSize: "0.9rem", fontFamily: "Georgia, serif",
                lineHeight: 1.5, transition: "all 0.2s" }}>
              {rev && i === q.ok && <i className="ti ti-check" style={{ fontSize: 12, marginRight: 8, color: GN }} aria-hidden="true" />}
              {rev && i === sel && i !== q.ok && <i className="ti ti-x" style={{ fontSize: 12, marginRight: 8, color: CR }} aria-hidden="true" />}
              {opt}
            </button>
          );
        })}
      </div>
      {!rev ? (
        <NBtn onClick={() => sel !== null && setRev(true)} disabled={sel === null}>Verificar resposta →</NBtn>
      ) : (
        <div>
          <p style={{ fontSize: "0.88rem", color: correct ? GN : MT, marginBottom: "1rem", fontFamily: "Georgia, serif" }}>
            {correct ? "+ 5 pontos! Resposta correta!" : "Não desta vez — mas agora você sabe a resposta!"}
          </p>
          <NBtn onClick={() => onSubmit(sel)} variant={correct ? "green" : "amber"}>
            {isLast ? "Ver resultado final →" : "Próximo capítulo →"}
          </NBtn>
        </div>
      )}
    </div>
  );
}

function End({ score, max, difficulty, learned, onRestart, onChapters }) {
  const pct = Math.round((score / max) * 100);
  const rank = pct >= 90 ? "Arquimago do Código" : pct >= 70 ? "Desenvolvedor Pleno" : pct >= 50 ? "Desenvolvedor Júnior" : "Aprendiz Promissor";
  return (
    <div style={{ textAlign: "center", paddingTop: "2rem", paddingBottom: "1rem" }}>
      <i className="ti ti-trophy" style={{ fontSize: 48, color: AM, display: "block", marginBottom: "1rem" }} aria-hidden="true" />
      <p style={{ fontSize: 10, letterSpacing: 3, color: AM, textTransform: "uppercase", marginBottom: "0.5rem" }}>Missão cumprida!</p>
      <h2 style={{ fontSize: "1.8rem", fontWeight: "normal", color: "#f0e4c8", marginBottom: "0.5rem", fontFamily: "Georgia, serif" }}>{rank}</h2>
      <p style={{ fontSize: "0.9rem", color: MT, marginBottom: "1.75rem", fontFamily: "Georgia, serif" }}>
        Modo: {difficulty} · {score} de {max} pontos possíveis ({pct}%)
      </p>
      <div style={{ background: SF, borderRadius: 8, padding: "0.5rem", marginBottom: "1.75rem", maxWidth: 300, margin: "0 auto 1.75rem" }}>
        <div style={{ height: 8, background: "rgba(239,159,39,0.15)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: pct >= 70 ? GN : AM, borderRadius: 99, transition: "width 1s ease" }} />
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginBottom: "2rem" }}>
        {learned.map((c, i) => (
          <span key={i} style={{ background: AL, border: `0.5px solid ${AB}`, color: AM, padding: "4px 14px", borderRadius: 4, fontSize: "0.82rem" }}>
            <i className="ti ti-check" style={{ fontSize: 11, marginRight: 5, verticalAlign: "-1px" }} aria-hidden="true" />
            {c.name}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <NBtn onClick={onRestart}>Jogar novamente →</NBtn>
        <NBtn onClick={onChapters}>Revisar capítulos →</NBtn>
      </div>
      <p style={{ fontSize: 12, color: MT, marginTop: "1.5rem", fontFamily: "Georgia, serif" }}>
        Continue sua jornada aprendendo Python, JavaScript ou qualquer linguagem que te inspire!
      </p>
    </div>
  );
}

// ─── app ──────────────────────────────────────────────────────
export default function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [idx, setIdx] = useState(-1);
  const [phase, setPhase] = useState("intro");
  const [choiceIdx, setChoiceIdx] = useState(null);
  const [score, setScore] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [learned, setLearned] = useState([]);
  const [glossary, setGlossary] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const scene = SCENES[idx] ?? null;
  const choice = scene && choiceIdx !== null ? scene.choices[choiceIdx] : null;
  const maxScore = SCENES.length * 15;
  const hintCost = difficulty === "desafiador" ? 2 : 0;
  const showHeader = idx >= 0 && phase !== "end" && phase !== "chapter-select";

  const go = (newPhase, newIdx) => {
    if (newIdx !== undefined) setIdx(newIdx);
    setPhase(newPhase);
    setAnimKey(k => k + 1);
  };

  const start = () => go("reading", 0);

  const pick = (i) => {
    setChoiceIdx(i);
    const pts = SCENES[idx].choices[i].good ? 10 : 0;
    setScore(s => s + pts);
    go("chosen");
  };

  const afterChosen = () => {
    if (choice?.branch) go("branch");
    else go("concept");
  };

  const toQuiz = () => go("quiz");

  const submitQuiz = (ans) => {
    const correct = ans === scene.quiz.ok;
    if (correct) setScore(s => s + 5);
    const newInv = inventory.find(s => s.id === scene.id) ? inventory : [...inventory, scene];
    const newLearned = learned.find(l => l.name === scene.concept.name) ? learned : [...learned, { name: scene.concept.name, cl: scene.concept.cl, sum: scene.concept.sum }];
    setInventory(newInv);
    setLearned(newLearned);
    const ni = idx + 1;
    if (ni >= SCENES.length) go("end");
    else { setChoiceIdx(null); setHintShown(false); go("reading", ni); }
  };

  const showHint = () => {
    if (hintCost > 0) setScore(s => Math.max(0, s - hintCost));
    setHintShown(true);
  };

  const restart = () => {
    setIdx(-1); setPhase("intro"); setChoiceIdx(null);
    setScore(0); setInventory([]); setLearned([]);
    setGlossary(false); setHintShown(false); setDifficulty(null);
    setAnimKey(k => k + 1);
  };

  const jumpTo = (i) => { setChoiceIdx(null); setHintShown(false); go("reading", i); };

  return (
    <div style={{ padding: "0.75rem 0" }}>
      <style>{`@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.fi{animation:fi 0.32s ease}`}</style>
      <div style={{ background: BG, borderRadius: 12, border: `0.5px solid ${AB}`, overflow: "hidden", minHeight: 480, fontFamily: "Georgia, serif", color: TX }}>
        <h2 className="sr-only">Terras do Código — RPG narrativo de programação</h2>
        <div style={{ padding: showHeader ? "1.75rem 2rem 0" : "2rem 2rem 0" }}>
          {showHeader && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "0.75rem" }}>
                <ScoreBadge score={score} max={maxScore} difficulty={difficulty} />
                <button onClick={() => go("chapter-select")} title="Selecionar capítulo"
                  style={{ marginLeft: "auto", background: "transparent", border: `0.5px solid ${AB}`, color: MT, padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 11 }}>
                  <i className="ti ti-menu-2" style={{ fontSize: 12 }} aria-hidden="true" />
                </button>
              </div>
              <ProgBar idx={idx} total={SCENES.length} />
              <InventoryBar inventory={inventory} />
            </>
          )}
        </div>

        <div key={animKey} className="fi" style={{ padding: showHeader ? "0 2rem 2rem" : "0 2rem 2rem" }}>
          {phase === "intro" && <Intro onStart={start} difficulty={difficulty} setDifficulty={setDifficulty} />}
          {phase === "chapter-select" && <ChapterSelect scenes={SCENES} inventory={inventory} onJump={jumpTo} onBack={() => go(idx < 0 ? "intro" : "reading")} />}
          {phase === "reading" && scene && <Reading scene={scene} difficulty={difficulty} hintShown={hintShown} onHint={showHint} onPick={pick} hintCost={hintCost} />}
          {phase === "chosen" && choice && <Chosen choice={choice} onContinue={afterChosen} />}
          {phase === "branch" && choice && <BranchScene choice={choice} onContinue={() => go("concept")} />}
          {phase === "concept" && scene && <ConceptCard scene={scene} isLast={idx === SCENES.length - 1} onNext={toQuiz} />}
          {phase === "quiz" && scene && <Quiz scene={scene} isLast={idx === SCENES.length - 1} onSubmit={submitQuiz} />}
          {phase === "end" && <End score={score} max={maxScore} difficulty={difficulty} learned={learned} onRestart={restart} onChapters={() => go("chapter-select")} />}
        </div>

        {idx >= 0 && phase !== "end" && (
          <div style={{ padding: "0 2rem" }}>
            <GlossaryPanel learned={learned} open={glossary} onToggle={() => setGlossary(g => !g)} />
          </div>
        )}
      </div>
    </div>
  );
}
