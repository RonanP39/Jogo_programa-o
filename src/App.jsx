import { useState, useEffect, useRef } from "react";

const TH={
  dark: {bg:"#1a1810",sf:"#22201a",cb:"#0e0b07",am:"#EF9F27",al:"rgba(239,159,39,.1)",ab:"rgba(239,159,39,.22)",tx:"#e0d4b4",mt:"rgba(224,212,180,.45)",gn:"#5DCAA5",cr:"#D85A30",nm:"Grimório Sombrio"},
  light:{bg:"#f0e8d0",sf:"#fdf7e8",cb:"#e2dcc8",am:"#7B4800",al:"rgba(123,72,0,.1)",ab:"rgba(123,72,0,.28)",tx:"#1a1004",mt:"rgba(26,16,4,.45)",gn:"#1A6B4A",cr:"#8B2000",nm:"Pergaminho Antigo"},
  cyber:{bg:"#04040e",sf:"#080820",cb:"#020209",am:"#00ffe0",al:"rgba(0,255,224,.07)",ab:"rgba(0,255,224,.22)",tx:"#c0f4ff",mt:"rgba(192,244,255,.38)",gn:"#00ff88",cr:"#ff2d78",nm:"Neon Futuro"},
};

function mkAudio(){try{const c=new(window.AudioContext||window.webkitAudioContext)();const t=(f,d,y="sine",v=.15)=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type=y;o.frequency.value=f;g.gain.setValueAtTime(v,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.start();o.stop(c.currentTime+d);};return{ok:()=>{t(523,.1);setTimeout(()=>t(784,.2),140);},err:()=>t(180,.3,"sawtooth",.1),click:()=>t(440,.04),win:()=>[523,659,784,1047].forEach((f,i)=>setTimeout(()=>t(f,.25),i*120)),tick:()=>t(880,.03,"square",.04)};}catch{return{ok:()=>{},err:()=>{},click:()=>{},win:()=>{},tick:()=>{}};}}

const ACH=[
  {id:"first_good",icon:"ti-star",       nm:"Primeiro Passo",  desc:"Primeira boa escolha"},
  {id:"no_hints",  icon:"ti-eye-off",    nm:"Sem Bengala",     desc:"Capítulo sem dicas"},
  {id:"streak3",   icon:"ti-brain",      nm:"Mente Afiada",    desc:"3 quizzes seguidos"},
  {id:"speed",     icon:"ti-bolt",       nm:"Relâmpago",       desc:"Capítulo em <25s"},
  {id:"polyglot",  icon:"ti-code",       nm:"Poliglota",       desc:"Viu Python e JS"},
  {id:"sandbox_a", icon:"ti-terminal-2", nm:"Mão na Massa",    desc:"Executou código real"},
  {id:"collector", icon:"ti-backpack",   nm:"Colecionador",    desc:"6+ itens coletados"},
  {id:"flawless",  icon:"ti-trophy",     nm:"Impecável",       desc:"Zero erros no jogo"},
  {id:"daily",     icon:"ti-calendar",   nm:"Disciplinado",    desc:"Desafio diário"},
  {id:"multi",     icon:"ti-users",      nm:"Competidor",      desc:"Modo multiplayer"},
];

const SCENES=[
  {id:"taverna",ch:"Cap. 1",title:"A Taverna da Memória",icon:"ti-home",portrait:{ic:"ti-wand",cl:"#9F77DD",nm:"Varinha, a elfa"},mapPos:{x:12,y:55},
   narr:`Você é Byte, aprendiz no Reino do Código. Sua missão: restaurar os sistemas do Grande Oráculo.\n\nA taverneira Varinha abre um enorme livro:\n\n— Para registrar sua presença, como prefere que eu anote seu nome?`,
   narrH:`Varinha precisa registrar seu nome. Como você faz isso?`,
   hint:"Variáveis são como caixas com etiqueta — guardam um valor pelo nome.",
   item:{icon:"ti-book",name:"Grande Registro"},
   concept:{nm:"Variáveis",cl:"#378ADD",bg:"rgba(55,138,221,.07)",bd:"rgba(55,138,221,.22)",
    sum:"Uma variável é uma caixa nomeada que guarda um valor. Crie quantas precisar e acesse o valor pelo nome.",
    py:`nome = "Byte"\nnivel = 1\nvida = 100\n\nprint(nome)    # → "Byte"\nprint(nivel)   # → 1\n\n# Reatribuir:\nnivel = 2\nprint(nivel)   # → 2`,
    js:`let nome = "Byte";\nlet nivel = 1;\nlet vida = 100;\n\nconsole.log(nome);   // → "Byte"\nconsole.log(nivel);  // → 1\n\n// Reatribuir:\nnivel = 2;\nconsole.log(nivel);  // → 2`},
   choices:[
    {text:'Registrar formalmente: nome = "Byte"',good:true,cons:`Varinha escreve: nome = "Byte". A etiqueta 'nome' aponta para 'Byte'.\n\n— Você criou uma VARIÁVEL! Acesse a qualquer momento apenas pelo nome.`},
    {text:"Anotar num guardanapo qualquer",good:false,cons:`O guardanapo voa pela janela com o vento.\n\n— Sem variável, a informação desapareceu para sempre!`,branch:`Varinha refaz o registro: nome = "Byte".\n\n— Veja: a etiqueta 'nome' aponta para 'Byte'. Assim funciona uma variável.`}],
   quiz:{q:"Qual a melhor definição de variável?",opts:["Caixa nomeada que guarda um valor","Lista de instruções a seguir","Tipo especial de número"],ok:0}},

  {id:"encruzilhada",ch:"Cap. 2",title:"A Encruzilhada das Decisões",icon:"ti-git-branch",portrait:{ic:"ti-shield",cl:"#5DCAA5",nm:"Guardião da Passagem"},mapPos:{x:28,y:42},
   narr:`Uma encruzilhada surge à frente. Um guarda imponente barra o caminho:\n\n— Alto! Só passa quem tem o Cristal de Acesso.\n\nVarinha te entregou algo brilhante ao sair. Como agir?`,
   narrH:`Guarda exige o Cristal de Acesso. Você tem ou não? Como agir?`,
   hint:"Sempre verifique a condição antes de agir — isso é um if/else.",
   item:{icon:"ti-diamond",name:"Cristal de Acesso"},
   concept:{nm:"Condicionais",cl:"#1D9E75",bg:"rgba(29,158,117,.07)",bd:"rgba(29,158,117,.22)",
    sum:"Condicionais permitem tomar decisões: SE uma condição for verdadeira, execute A; SENÃO, execute B.",
    py:`if tem_cristal:\n    passar_guarda()\nelse:\n    procurar_saida()\n\n# Encadeado:\nif vida > 50: atacar()\nelif vida > 20: defender()\nelse: fugir()`,
    js:`if (temCristal) {\n    passarGuarda();\n} else {\n    procurarSaida();\n}\n\n// Encadeado:\nif (vida>50) atacar();\nelse if (vida>20) defender();\nelse fugir();`},
   choices:[
    {text:"Verificar o inventário antes de responder",good:true,cons:`SE tenho cristal... SIM! Está no bolso!\n\n— Você avaliou a condição antes de agir. Isso é um CONDICIONAL perfeito.`},
    {text:"Assumir que não tem e pedir ajuda",good:false,cons:`O guarda aponta pro bolso — o cristal brilhava lá.\n\n— Assumiu sem verificar! Em código, nunca assuma.`,branch:`— if (tem_cristal) { passar() } teria verificado primeiro. Teste, nunca assuma.`}],
   quiz:{q:"O que acontece quando o 'if' é falso e há 'else'?",opts:["Programa encerra","Bloco 'else' executa","Condição testada novamente"],ok:1}},

  {id:"torre",ch:"Cap. 3",title:"A Torre dos Loops",icon:"ti-refresh",portrait:{ic:"ti-mood-smile",cl:"#EF9F27",nm:"Duende da Torre"},mapPos:{x:42,y:30},
   narr:`Torre de 100 degraus de pedra cinza. Um duende sorridente:\n\n— Uma pedra mágica em cada degrau. Todas as 100.\n\nEle entrega uma sacola e pisca enigmaticamente.`,
   narrH:`100 degraus, uma pedra cada. Como resolver eficientemente?`,
   hint:"Para repetir a mesma ação muitas vezes, use for ou while.",
   item:{icon:"ti-circles",name:"Pedras Mágicas"},
   concept:{nm:"Loops",cl:"#D85A30",bg:"rgba(216,90,48,.07)",bd:"rgba(216,90,48,.22)",
    sum:"Loops repetem um bloco automaticamente. Em vez de 100 linhas idênticas, você escreve uma vez.",
    py:`for degrau in range(1, 101):\n    colocar_pedra(degrau)\n\n# While:\ncontador = 0\nwhile contador < 100:\n    colocar_pedra(contador)\n    contador += 1`,
    js:`for (let d=1; d<=100; d++) {\n    colocarPedra(d);\n}\n\n// While:\nlet c = 0;\nwhile (c < 100) {\n    colocarPedra(c++);\n}`},
   choices:[
    {text:"Feitiço que se repete 100x automaticamente",good:true,cons:`Pedras voam e se posicionam em segundos!\n\n— Um LOOP! Descreveu o padrão uma vez, executou 100 vezes.`},
    {text:"Subir e colocar cada pedra manualmente",good:false,cons:`No degrau 67 seus joelhos protestam.\n\n— Loops existem para isso. Imagine 10.000 degraus!`,branch:`— for degrau in range(100): colocar(degrau). Uma linha = 100 ações.`}],
   quiz:{q:"'for i in range(5)' executa quantas vezes?",opts:["4","5","6"],ok:1}},

  {id:"oficina",ch:"Cap. 4",title:"A Oficina das Funções",icon:"ti-tool",portrait:{ic:"ti-hammer",cl:"#BA7517",nm:"Mestre Artesã"},mapPos:{x:55,y:24},
   narr:`No alto da torre: uma oficina. A mestre artesã:\n\n— 50 tochas para acender. Cada uma: pegar fósforo, riscar, aproximar, soprar.\n\nComo organizar para não errar nenhuma etapa?`,
   narrH:`50 tochas, 4 passos cada. Como não errar nenhuma etapa?`,
   hint:"Encapsule os passos em um bloco com nome que pode ser chamado quantas vezes quiser.",
   item:{icon:"ti-flame",name:"Fogo Perpétuo"},
   concept:{nm:"Funções",cl:"#7F77DD",bg:"rgba(127,119,221,.07)",bd:"rgba(127,119,221,.22)",
    sum:"Uma função é um bloco de código com nome. Escreva uma vez, execute quantas vezes quiser — sem repetição.",
    py:`def acender_tocha():\n    pegar_fosforo()\n    riscar()\n    aproximar_chama()\n    soprar_suave()\n\nfor i in range(50):\n    acender_tocha()  # perfeita toda vez!\n\n# Com retorno:\ndef saudar(nome):\n    return "Olá, " + nome`,
    js:`function acenderTocha() {\n    pegarFosforo();\n    riscar();\n    aproximarChama();\n    soprarSuave();\n}\n\nfor(let i=0;i<50;i++) acenderTocha();\n\n// Com retorno:\nfunction saudar(nome) {\n    return "Olá, " + nome;\n}`},
   choices:[
    {text:"Criar feitiço reutilizável: acender_tocha()",good:true,cons:`50 tochas acesas com precisão perfeita!\n\n— FUNÇÃO! Uma vez escrita, chame quantas vezes quiser. Perfeita toda vez.`},
    {text:"Memorizar os passos e repetir mentalmente",good:false,cons:`Na tocha 23 você erra a ordem. Na 31, esquece o fósforo.\n\n— Funções garantem a sequência correta toda vez!`,branch:`— def acender_tocha(): [4 passos]. Chamada 50x = perfeição 50x.`}],
   quiz:{q:"Principal vantagem das funções?",opts:["Executam mais rápido","Evitam repetição e facilitam manutenção","Só funcionam com números"],ok:1}},

  {id:"mercado",ch:"Cap. 5",title:"O Mercado das Listas",icon:"ti-list",portrait:{ic:"ti-building-store",cl:"#BA7517",nm:"Mercador Festivo"},mapPos:{x:65,y:38},
   narr:`O Mercado das Maravilhas. O mercador empilha 10 itens na bancada:\n\nEspada. Escudo. Poção. Mapa. Bússola. Lanterna. Corda. Pederneira. Cantil. Pergaminho.\n\n— Como vai organizar tudo isso?`,
   narrH:`10 itens para guardar. Como organizar na memória?`,
   hint:"Quando há muitos valores relacionados, agrupe em um array (lista).",
   item:{icon:"ti-backpack",name:"Bolsa Mágica"},
   concept:{nm:"Arrays",cl:"#BA7517",bg:"rgba(186,117,23,.07)",bd:"rgba(186,117,23,.22)",
    sum:"Um array é uma coleção ordenada de valores sob um nome. Acesse pelo índice, começando em 0.",
    py:`itens = ["espada","escudo","poção","mapa","bússola"]\n\nitens[0]        # → "espada"\nitens[-1]       # → "bússola"\nlen(itens)      # → 5\nitens.append("corda")\nitens.remove("mapa")`,
    js:`const itens = ["espada","escudo","poção","mapa","bússola"];\n\nitens[0];           // → "espada"\nitens.at(-1);       // → "bússola"\nitens.length;       // → 5\nitens.push("corda");\nitens.splice(3,1);`},
   choices:[
    {text:'Lista: suprimentos = ["espada","escudo"...]',good:true,cons:`Tudo organizado! suprimentos[0] → "espada". len() → 10.\n\n— ARRAY! Valores agrupados, acessados por índice. Escalável.`},
    {text:"Variável separada para cada item",good:false,cons:`Com 10 itens: confuso. Com 10.000: impossível.\n\n— Arrays agrupam dados com posições indexadas.`,branch:`— suprimentos[0] é sempre "espada". Previsível. Arrays escalam infinitamente.`}],
   quiz:{q:"Qual o índice do PRIMEIRO elemento de um array?",opts:["1","0","-1"],ok:1}},

  {id:"castelo",ch:"Cap. 6",title:"O Castelo dos Objetos",icon:"ti-crown",portrait:{ic:"ti-spy",cl:"#5DCAA5",nm:"Porteiro Gnomo"},mapPos:{x:72,y:52},
   narr:`O Castelo do Código. O porteiro gnomo exige perfil completo:\n\n— Nome, nível, classe e pontos de vida. Quatro informações sobre a mesma entidade.\n\nComo vai organizar?`,
   narrH:`Porteiro quer nome, nível, classe e vida. Como agrupar tudo?`,
   hint:"Dados de uma mesma entidade ficam melhor agrupados em um objeto.",
   item:{icon:"ti-shield",name:"Brasão do Castelo"},
   concept:{nm:"Objetos",cl:"#1D9E75",bg:"rgba(29,158,117,.07)",bd:"rgba(29,158,117,.22)",
    sum:"Um objeto agrupa dados relacionados de uma entidade. Acesse com objeto['chave'] ou objeto.chave.",
    py:`heroi = {\n    "nome": "Byte",\n    "nivel": 6,\n    "classe": "Desenvolvedor",\n    "vida": 100\n}\n\nheroi["nome"]    # → "Byte"\nheroi["vida"] = 80\nheroi["xp"] = 500  # novo campo`,
    js:`const heroi = {\n    nome: "Byte",\n    nivel: 6,\n    classe: "Desenvolvedor",\n    vida: 100\n};\n\nheroi.nome;       // → "Byte"\nheroi.vida = 80;\nheroi.xp = 500;  // novo campo`},
   choices:[
    {text:"Criar objeto herói com todas as propriedades",good:true,cons:`heroi.nome, heroi.vida — organizado e coeso!\n\n— OBJETO! Entidade única, propriedades acessíveis. Modela o mundo real.`},
    {text:"Variáveis separadas para cada dado",good:false,cons:`'vida' conflita com a vida do porteiro. Caos.\n\n— Objetos criam um espaço próprio para cada entidade.`,branch:`— heroi.vida é inequívoco. 'vida' solta colide com outras vars.`}],
   quiz:{q:"Como acessar 'nome' do objeto 'heroi'?",opts:["heroi[nome]","heroi.nome ou heroi['nome']","nome.heroi"],ok:1}},

  {id:"oraculo",ch:"Cap. 7",title:"O Oráculo do Debug",icon:"ti-bug",portrait:{ic:"ti-eye",cl:"#E24B4A",nm:"Grande Oráculo"},mapPos:{x:78,y:65},
   narr:`O Oráculo pulsa em vermelho. Telas de alarme:\n\n    NameError: 'cristal_de_aceso' não definido\n    linha 42\n\n— Os sistemas do reino estão falhando. Corrija o bug!`,
   narrH:`NameError: 'cristal_de_aceso' não definido — linha 42. O que você faz?`,
   hint:"Leia a mensagem de erro — ela diz O QUÊ falhou e em qual linha.",
   item:{icon:"ti-zoom-in",name:"Lupa do Debug"},
   concept:{nm:"Debugging",cl:"#E24B4A",bg:"rgba(226,75,74,.07)",bd:"rgba(226,75,74,.22)",
    sum:"Debugging é encontrar e corrigir bugs. A mensagem de erro diz O QUÊ e ONDE. Leia com atenção.",
    py:`# Erro original:\ncristal_de_aceso    # ← falta um 's'!\n\n# Correção:\ncristal_de_acesso\n\n# Tipos de erro comuns:\n# NameError   → variável não definida\n# TypeError   → tipo errado\n# SyntaxError → código malformado`,
    js:`// Erro original:\ncristalDeAceso;     // ← falta um 's'!\n\n// Correção:\ncristalDeAcesso;\n\n// Tipos comuns:\n// ReferenceError → não definido\n// TypeError      → tipo errado\n// SyntaxError    → malformado`},
   choices:[
    {text:"Ler o erro e corrigir cirurgicamente",good:true,cons:`'cristal_de_aceso' vs 'cristal_de_acesso' — um 's'! Corrigido!\n\n— Você debugou! Um caractere pode derrubar um sistema inteiro.`},
    {text:"Reescrever tudo do zero com medo",good:false,cons:`Você replica o mesmo erro. Sistema continua falhando.\n\n— Bugs não somem com pânico. Leia, localize, corrija.`,branch:`— A mensagem dizia: linha 42, 'cristal_de_aceso'. Cirurgia, não demolição.`}],
   quiz:{q:"O que 'NameError' indica?",opts:["Erro de sintaxe","Variável usada sem ser definida","Divisão por zero"],ok:1}},

  {id:"biblioteca",ch:"Cap. 8",title:"A Biblioteca dos Textos",icon:"ti-book",portrait:{ic:"ti-feather",cl:"#D4537E",nm:"Fada Escriba"},mapPos:{x:68,y:75},
   narr:`A Biblioteca dos Textos. A fada escriba precisa criar índices únicos:\n\n    "A Lenda" + " #" + "42"\n\n— Como você manipularia texto assim?`,
   narrH:`Concatenar "A Lenda" + " #" + "42". Como fazer?`,
   hint:"Strings podem ser unidas com o operador + — isso é concatenação.",
   item:{icon:"ti-scroll",name:"Pergaminho Antigo"},
   concept:{nm:"Strings",cl:"#D4537E",bg:"rgba(212,83,126,.07)",bd:"rgba(212,83,126,.22)",
    sum:"Strings são sequências de texto. Concatene, fatie, busque, transforme. Tipo de dado mais comum.",
    py:`titulo = "A Lenda"\nindice = titulo + " #42"   # "A Lenda #42"\n\ntitulo.upper()    # "A LENDA"\ntitulo.lower()    # "a lenda"\nlen(titulo)       # 7\ntitulo[0]         # "A"\ntitulo.split(" ") # ["A","Lenda"]`,
    js:`const titulo = "A Lenda";\nconst indice = titulo + " #42"; // "A Lenda #42"\n\ntitulo.toUpperCase(); // "A LENDA"\ntitulo.toLowerCase(); // "a lenda"\ntitulo.length;        // 7\ntitulo[0];            // "A"\ntitulo.split(" ");    // ["A","Lenda"]`},
   choices:[
    {text:'Concatenar: "A Lenda" + " #" + "42"',good:true,cons:`"A Lenda #42"! Strings unidas com +.\n\n— STRINGS têm dezenas de operações: fatiar, buscar, transformar.`},
    {text:'Somar como números: 42 + "A Lenda"',good:false,cons:`TypeError! Número não soma com texto diretamente.\n\n— Converta primeiro: str(42) em Python, String(42) em JS.`,branch:`— "A Lenda #" + str(42) → "A Lenda #42". Tipo importa.`}],
   quiz:{q:"O que 'texto'.upper() faz?",opts:["Converte para maiúsculas","Remove espaços","Inverte o texto"],ok:0}},

  {id:"portal",ch:"Cap. 9",title:"O Portal da Verdade",icon:"ti-toggle-right",portrait:{ic:"ti-yin-yang",cl:"#534AB7",nm:"Guardiões da Verdade"},mapPos:{x:58,y:85},
   narr:`Portal dos Guardiões Verdade e Falsidade:\n\n— Existem apenas dois estados: VERDADEIRO ou FALSO. Nada mais.\n\nComo você representa esse conceito em código?`,
   narrH:`Apenas dois estados: verdadeiro ou falso. Como representar?`,
   hint:"Existe um tipo especial para valores que só podem ser true ou false — booleanos.",
   item:{icon:"ti-eye",name:"Olho da Verdade"},
   concept:{nm:"Booleans",cl:"#534AB7",bg:"rgba(83,74,183,.07)",bd:"rgba(83,74,183,.22)",
    sum:"Booleanos: True ou False. São o resultado de comparações e a base de toda lógica condicional.",
    py:`ativo = True\nmorto = False\n\n5 > 3          # True\n"a" == "b"     # False\n10 != 5        # True\n\nTrue and False  # False\nTrue or False   # True\nnot True        # False`,
    js:`let ativo = true;\nlet morto = false;\n\n5 > 3;          // true\n"a" === "b";    // false\n10 !== 5;       // true\n\ntrue && false;  // false\ntrue || false;  // true\n!true;          // false`},
   choices:[
    {text:"ativo = True, derrotado = False",good:true,cons:`Guardiões inclinam-se.\n\n— BOOLEANS! Tipo mais simples. Toda comparação retorna True/False. Base da lógica.`},
    {text:'estado = "sim" ou estado = "não"',good:false,cons:`"sim", "Sim", "SIM" — três valores diferentes! Ambiguidade fatal.\n\n— True/False são universais e sem variações.`,branch:`— if estado=="sim": e alguém digita "Sim" — bug! True/False nunca variam.`}],
   quiz:{q:"O que '10 > 5' retorna?",opts:["10","True","5"],ok:1}},

  {id:"museu",ch:"Cap. 10",title:"O Museu dos Tipos",icon:"ti-flask",portrait:{ic:"ti-microscope",cl:"#BA7517",nm:"Curadora do Museu"},mapPos:{x:45,y:80},
   narr:`O Museu dos Valores cataloga toda informação do reino.\n\nUm aprendiz precisa guardar: nome, pontuação, se está ativo e lista de itens.\n\nQual tipo para cada dado?`,
   narrH:`Nome, pontuação, ativo(sim/não), lista de itens. Qual tipo para cada?`,
   hint:"str para texto, int/float para números, bool para verdadeiro/falso, list para coleções.",
   item:{icon:"ti-flask",name:"Frasco de Tipos"},
   concept:{nm:"Tipos de dados",cl:"#BA7517",bg:"rgba(186,117,23,.07)",bd:"rgba(186,117,23,.22)",
    sum:"Todo valor tem um tipo: str, int, float, bool, list. O tipo define o que você pode fazer com o valor.",
    py:`nome   = "Byte"      # str\npontos = 42           # int\ntemp   = 36.5         # float\nativo  = True         # bool\nitens  = ["espada"]   # list\n\ntype(nome)   # <class 'str'>\nint("42")    # 42\nstr(100)     # "100"`,
    js:`const nome   = "Byte";      // string\nconst pontos = 42;           // number\nconst temp   = 36.5;         // number\nconst ativo  = true;         // boolean\nconst itens  = ["espada"];   // array\n\ntypeof nome;   // "string"\nNumber("42");  // 42\nString(100);   // "100"`},
   choices:[
    {text:"nome→str, pontos→int, ativo→bool, itens→list",good:true,cons:`Todos corretos!\n\n— "42"+"10"="4210" (str). 42+10=52 (int). TIPOS definem as operações.`},
    {text:'Tudo como texto — é mais simples',good:false,cons:`"42"+"10"="4210", não 52! Bugs matemáticos silenciosos.\n\n— Tipo errado cria problemas invisíveis.`,branch:`— "42" é texto, 42 é número. Nunca confunda.`}],
   quiz:{q:"Qual o tipo de 3.14 em Python?",opts:["str","int","float"],ok:2}},

  {id:"espelho",ch:"Cap. 11",title:"A Torre do Espelho",icon:"ti-infinity",portrait:{ic:"ti-sparkles",cl:"#378ADD",nm:"Feiticeira Anciã"},mapPos:{x:32,y:70},
   narr:`Torre de espelhos que refletem espelhos. A feiticeira:\n\n— Calcule degraus que dobram a cada andar. Andar 1: 1. Andar N: dobro do anterior.\n\nExiste solução elegante onde a função chama a si mesma.`,
   narrH:`degraus(N) = degraus(N-1) × 2. Função que chama a si mesma?`,
   hint:"Uma função pode chamar a si mesma com um problema menor — isso é recursão.",
   item:{icon:"ti-infinity",name:"Espelho Recursivo"},
   concept:{nm:"Recursão",cl:"#378ADD",bg:"rgba(55,138,221,.07)",bd:"rgba(55,138,221,.22)",
    sum:"Recursão: função que chama a si mesma. Precisa de caso base (parada) e caso recursivo.",
    py:`def degraus(n):\n    if n == 1: return 1      # caso base\n    return degraus(n-1) * 2  # recursivo\n\ndegraus(4)  # → 8\n# 1→1, 2→2, 3→4, 4→8\n\ndef fatorial(n):\n    if n == 0: return 1\n    return n * fatorial(n-1)`,
    js:`function degraus(n) {\n    if (n===1) return 1;       // base\n    return degraus(n-1) * 2;  // recursivo\n}\n\ndegraus(4); // → 8\n\nfunction fat(n) {\n    if (n===0) return 1;\n    return n * fat(n-1);\n}`},
   choices:[
    {text:"Função que chama a si mesma (recursão)",good:true,cons:`Espelhos se constroem em cascata!\n\n— RECURSÃO! A função descreve o padrão matematicamente. Caso base garante a parada.`},
    {text:"Loop multiplicando por 2 a cada vez",good:false,cons:`Funciona! Mas existe forma mais elegante.\n\n— Recursão expressa degraus(N) = degraus(N-1)*2 diretamente.`,branch:`— Loops são eficazes. Recursão é natural para problemas que se dividem em versões menores.`}],
   quiz:{q:"O que é o 'caso base' na recursão?",opts:["O primeiro parâmetro","A condição que para a recursão","O valor mais retornado"],ok:1}},

  {id:"camara",ch:"Cap. 12",title:"A Câmara da Resiliência",icon:"ti-shield-check",portrait:{ic:"ti-shield-half",cl:"#1D9E75",nm:"Arcanista Idoso"},mapPos:{x:20,y:82},
   narr:`A Câmara Final. O arcanista te desafia:\n\n— Sistemas recebem entradas inválidas às vezes. Um bom desenvolvedor antecipa falhas.\n\nComo proteger o código de erros inesperados sem travá-lo?`,
   narrH:`Entradas inválidas causam erros. Como proteger sem travar?`,
   hint:"Existe uma estrutura para 'tentar' e 'capturar' se falhar.",
   item:{icon:"ti-shield-check",name:"Amuleto Protetor"},
   concept:{nm:"Try / Except",cl:"#1D9E75",bg:"rgba(29,158,117,.07)",bd:"rgba(29,158,117,.22)",
    sum:"Try/Except protege de erros inesperados. Tente; se falhar, capture e trate. O programa continua.",
    py:`try:\n    n = int(input("Número: "))\n    print(100 / n)\nexcept ValueError:\n    print("Não é número!")\nexcept ZeroDivisionError:\n    print("Não divide por zero!")\nfinally:\n    print("Sempre executa")`,
    js:`try {\n    const n = Number(prompt("Número:"));\n    console.log(100 / n);\n} catch(e) {\n    console.log("Erro:", e.message);\n} finally {\n    console.log("Sempre executa");\n}`},
   choices:[
    {text:"try/except para capturar o erro com elegância",good:true,cons:`Sistema absorve entrada inválida sem travar!\n\n— TRY/EXCEPT! O escudo do programador. Resiliência em código.`},
    {text:"Ignorar — erros são raros",good:false,cons:`Na primeira entrada inválida, sistema trava completamente.\n\n— Erros ACONTECEM. Sempre. Antecipe-os.`,branch:`— try/except captura, mostra mensagem amigável e continua. Isso é resiliência.`}],
   quiz:{q:"O que 'finally' faz?",opts:["Só executa se houver erro","Executa sempre, com ou sem erro","Cancela o erro"],ok:1}},

  {id:"academia",ch:"Cap. 13",title:"A Academia das Classes",icon:"ti-school",portrait:{ic:"ti-users-group",cl:"#9F77DD",nm:"Grão-Mestre Objectus"},mapPos:{x:85,y:28},
   narr:`A Academia das Classes. O Grão-Mestre explica:\n\n— Funções e dados que pertencem juntos formam uma CLASSE — molde para criar objetos.\n\nComo você modelaria vários heróis com as mesmas propriedades?`,
   narrH:`Vários heróis com nome, nível e vida. Como criar um molde reutilizável?`,
   hint:"Uma classe é um molde para criar objetos com as mesmas propriedades e métodos.",
   item:{icon:"ti-certificate",name:"Diploma da Academia"},
   concept:{nm:"Classes (POO)",cl:"#9F77DD",bg:"rgba(159,119,221,.07)",bd:"rgba(159,119,221,.22)",
    sum:"Uma classe é um molde para criar objetos (instâncias). Define propriedades e métodos compartilhados.",
    py:`class Heroi:\n    def __init__(self, nome, nivel):\n        self.nome = nome\n        self.nivel = nivel\n        self.vida = 100\n\n    def atacar(self):\n        return f"{self.nome} ataca!"\n\nbyte = Heroi("Byte", 1)\nbyte.atacar()  # "Byte ataca!"`,
    js:`class Heroi {\n    constructor(nome, nivel) {\n        this.nome = nome;\n        this.nivel = nivel;\n        this.vida = 100;\n    }\n    atacar() {\n        return this.nome + " ataca!";\n    }\n}\n\nconst byte = new Heroi("Byte", 1);\nbyte.atacar(); // "Byte ataca!"`},
   choices:[
    {text:"Criar classe Heroi como molde reutilizável",good:true,cons:`Byte, Pixel, Dev — todos do mesmo molde!\n\n— CLASSES! Instâncias compartilham estrutura, têm dados próprios.`},
    {text:"Copiar e colar o objeto manualmente",good:false,cons:`Três heróis = três cópias. Uma mudança = editar tudo.\n\n— Classes existem para evitar exatamente isso.`,branch:`— class Heroi uma vez. new Heroi() cria quantas instâncias quiser.`}],
   quiz:{q:"O que '__init__' faz em Python?",opts:["Destrói o objeto","Inicializa ao ser criado","Lista todos os métodos"],ok:1}},

  {id:"mensageiro",ch:"Cap. 14",title:"O Mensageiro Assíncrono",icon:"ti-clock-bolt",portrait:{ic:"ti-run",cl:"#EF9F27",nm:"Mensageiro Temporal"},mapPos:{x:88,y:48},
   narr:`O Mensageiro Assíncrono corre entre reinos. Cada entrega demora um tempo desconhecido.\n\n— Não posso bloquear o reino inteiro esperando minha volta.\n\nComo lidar com operações que demoram?`,
   narrH:`Operação que demora tempo desconhecido. Como não bloquear o programa?`,
   hint:"Use async/await para lidar com operações lentas sem bloquear o restante.",
   item:{icon:"ti-mail-fast",name:"Carta Assíncrona"},
   concept:{nm:"Async / Await",cl:"#EF9F27",bg:"rgba(239,159,39,.07)",bd:"rgba(239,159,39,.22)",
    sum:"Async/await lida com operações que levam tempo (rede, arquivos) sem bloquear o restante do código.",
    py:`import asyncio\n\nasync def buscar_dados():\n    await asyncio.sleep(1)  # simula espera\n    return "dados prontos"\n\nasync def main():\n    resultado = await buscar_dados()\n    print(resultado)\n\nasyncio.run(main())`,
    js:`async function buscarDados() {\n    const resp = await fetch("/api/dados");\n    const json = await resp.json();\n    return json;\n}\n\n// Usando:\nconst dados = await buscarDados();\nconsole.log(dados);\n\n// Ou com .then():\nbuscarDados().then(d => console.log(d));`},
   choices:[
    {text:"Usar async/await para não bloquear",good:true,cons:`O reino continua funcionando enquanto aguarda!\n\n— ASYNC/AWAIT! Operações lentas não bloqueiam o resto. await pausa só aquela tarefa.`},
    {text:"Esperar de forma síncrona (trava tudo)",good:false,cons:`O reino inteiro congela esperando a mensagem.\n\n— Código síncrono bloqueia. Async existe para isso.`,branch:`— await diz: espere isso, mas continue o resto. Nada trava.`}],
   quiz:{q:"O que 'await' faz?",opts:["Cancela a operação","Espera a Promise sem bloquear","Repete a chamada"],ok:1}},

  {id:"feiticeiro",ch:"Cap. 15",title:"O Feiticeiro dos Padrões",icon:"ti-wand",portrait:{ic:"ti-sparkles",cl:"#D4537E",nm:"Feiticeiro Regex"},mapPos:{x:82,y:70},
   narr:`O Feiticeiro dos Padrões controla textos com feitiços arcanos:\n\n— Quero encontrar todo e-mail num pergaminho de 1000 linhas.\n\nComo você buscaria padrões complexos em texto?`,
   narrH:`Encontrar todos os e-mails em texto longo. Qual abordagem usar?`,
   hint:"Expressões regulares (regex) definem padrões para buscar e validar texto.",
   item:{icon:"ti-wand",name:"Varinha dos Padrões"},
   concept:{nm:"Regex",cl:"#D4537E",bg:"rgba(212,83,126,.07)",bd:"rgba(212,83,126,.22)",
    sum:"Regex são padrões para buscar e validar texto. Uma linha de regex substitui dezenas de verificações.",
    py:`import re\n\ntexto = "Email: byte@codigo.com.br"\n\n# Encontrar emails:\npadrao = r'[\\w.]+@[\\w.]+'\nemails = re.findall(padrao, texto)\n# → ['byte@codigo.com.br']\n\n# Validar CEP:\nre.match(r'^\\d{5}-\\d{3}$', "01310-100")`,
    js:`const texto = "Email: byte@codigo.com.br";\n\n// Encontrar emails:\nconst padrao = /[\\w.]+@[\\w.]+/g;\nconst emails = texto.match(padrao);\n// → ['byte@codigo.com.br']\n\n// Validar CEP:\n/^\\d{5}-\\d{3}$/.test("01310-100");\n// → true`},
   choices:[
    {text:"Usar regex para descrever o padrão de e-mail",good:true,cons:`Todos os e-mails encontrados em milissegundos!\n\n— REGEX! Um padrão que substitui 50 linhas de código. Um superpoder.`},
    {text:"Verificar manualmente linha por linha",good:false,cons:`1000 linhas verificadas uma a uma. Horas.\n\n— Regex faz em uma linha o que 50 linhas fariam.`,branch:`— r'[\\w.]+@[\\w.]+' captura qualquer e-mail. Regex é difícil no início, poderoso para sempre.`}],
   quiz:{q:"Para que serve regex?",opts:["Criar classes","Buscar e validar padrões em texto","Loops eficientes"],ok:1}},

  {id:"biblioteca2",ch:"Cap. 16",title:"A Biblioteca Caótica",icon:"ti-sort-ascending",portrait:{ic:"ti-books",cl:"#5DCAA5",nm:"Bibliotecária Caótica"},mapPos:{x:15,y:42},
   narr:`A Biblioteca Caótica tem 1 milhão de livros fora de ordem. A bibliotecária:\n\n— Para organizar, existem vários algoritmos. Qual você escolhe?\n\nBubble Sort, Quicksort ou Mergesort?`,
   narrH:`1 milhão de livros fora de ordem. Qual algoritmo de ordenação usar?`,
   hint:"Algoritmos de ordenação têm eficiências diferentes — para dados grandes, O(n log n) é essencial.",
   item:{icon:"ti-sort-ascending",name:"Índice Ordenado"},
   concept:{nm:"Algoritmos de Ordenação",cl:"#5DCAA5",bg:"rgba(93,202,165,.07)",bd:"rgba(93,202,165,.22)",
    sum:"Algoritmos de ordenação organizam dados. Cada um tem trade-offs. Para dados grandes, escolha O(n log n).",
    py:`# Bubble Sort — didático, O(n²)\ndef bubble(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j],arr[j+1] = arr[j+1],arr[j]\n\n# Python built-in — O(n log n)\nlista.sort()\nresult = sorted(lista)`,
    js:`// Bubble Sort — didático, O(n²)\nfunction bubble(arr) {\n    for(let i=0;i<arr.length;i++)\n        for(let j=0;j<arr.length-i-1;j++)\n            if(arr[j]>arr[j+1])\n                [arr[j],arr[j+1]]=[arr[j+1],arr[j]];\n}\n\n// Built-in — O(n log n)\narr.sort();\n[...arr].sort((a,b)=>a-b);`},
   choices:[
    {text:"Quicksort/Mergesort — O(n log n)",good:true,cons:`1 milhão ordenado em segundos!\n\n— O(n log n) escala. Bubble Sort em 1M itens: horas. Quicksort: milissegundos.`},
    {text:"Bubble Sort — fácil de entender",good:false,cons:`3 horas depois, 1% organizado.\n\n— Bubble Sort é O(n²). Para 1M itens: impraticável.`,branch:`— Bubble Sort é ótimo para aprender. Para produção: sempre O(n log n) ou melhor.`}],
   quiz:{q:"Qual a complexidade do Bubble Sort?",opts:["O(1)","O(n log n)","O(n²)"],ok:2}},

  {id:"oraculo2",ch:"Cap. 17",title:"O Oráculo da Eficiência",icon:"ti-chart-bar",portrait:{ic:"ti-infinity",cl:"#E24B4A",nm:"Oráculo da Eficiência"},mapPos:{x:50,y:50},
   narr:`O Oráculo Final avalia sua eficiência:\n\n— Dois algoritmos resolvem o mesmo problema. Um é O(n²), outro O(log n).\n\nPara n = 1.000.000: qual a diferença prática?`,
   narrH:`O(n²) vs O(log n) para n=1.000.000. Qual a diferença?`,
   hint:"Big O descreve como o tempo cresce conforme n aumenta — não meça velocidade, meça crescimento.",
   item:{icon:"ti-chart-bar",name:"Grimório da Eficiência"},
   concept:{nm:"Big O Notation",cl:"#E24B4A",bg:"rgba(226,75,74,.07)",bd:"rgba(226,75,74,.22)",
    sum:"Big O descreve a eficiência de algoritmos. O(1) constante, O(log n) excelente, O(n) linear, O(n²) lento.",
    py:`# O(1) — constante: sempre igual\ndef primeiro(lista):\n    return lista[0]\n\n# O(n) — linear: cresce com n\ndef busca_linear(lista, alvo):\n    for item in lista:\n        if item == alvo: return True\n\n# O(log n) — logarítmico: excelente\n# busca binária: divide o problema pela metade\n\n# O(n²) — quadrático: evitar em escala\n# bubble sort: loop dentro de loop`,
    js:`// O(1) — constante\nconst primeiro = arr[0];\n\n// O(n) — linear\nconst achou = arr.find(x => x === alvo);\n\n// O(n log n) — ótimo para ordenação\narr.sort();\n\n// O(n²) — quadrático, evitar em escala\nfor(let i=0;i<n;i++)\n    for(let j=0;j<n;j++) ...\n// n=1M → 1 trilhão de operações!`},
   choices:[
    {text:"O(log n) — diferença é astronômica",good:true,cons:`O(n²) em 1M: 1 trilhão de ops. O(log n): ~20 ops.\n\n— BIG O! Eficiência não é detalhe — é a diferença entre possível e impossível.`},
    {text:"A diferença é pequena, ambos funcionam",good:false,cons:`O(n²) em 1M levaria horas. O(log n): milissegundos.\n\n— Em escala, a diferença é ASTRONÔMICA.`,branch:`— 1.000.000² = 10¹² operações vs log₂(1.000.000) ≈ 20. Isso é Big O.`}],
   quiz:{q:"Qual Big O é mais eficiente?",opts:["O(n²)","O(n)","O(log n)"],ok:2}},
];

// ── SMALL UTILITY COMPONENTS ────────────────────────────────
function NBtn({children,onClick,disabled,T}){const[h,sh]=useState(false);return(<button onClick={onClick} disabled={disabled} onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)} style={{background:"transparent",border:`0.5px solid ${disabled?T.ab:T.am}`,color:disabled?T.mt:T.am,padding:"0.6rem 1.4rem",fontSize:"0.88rem",fontFamily:"Georgia,serif",cursor:disabled?"default":"pointer",borderRadius:"6px",opacity:h&&!disabled?1:0.85,transition:"opacity 0.2s"}}>{children}</button>);}

function CBtn({children,onClick,T}){const[h,sh]=useState(false);return(<button onClick={onClick} onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)} style={{background:h?T.al:"transparent",border:`0.5px solid ${h?T.am:T.ab}`,color:T.tx,padding:"0.85rem 1.1rem",textAlign:"left",cursor:"pointer",borderRadius:"8px",fontSize:"0.92rem",fontFamily:"Georgia,serif",lineHeight:1.5,width:"100%",transition:"all 0.18s"}}><i className="ti ti-arrow-right" style={{fontSize:13,marginRight:8,color:T.am,verticalAlign:"-1px"}} aria-hidden="true"/>{children}</button>);}

function ProgBar({idx,total,T}){return(<div style={{display:"flex",gap:4,marginBottom:"1.5rem"}}>{Array.from({length:total},(_,i)=>(<div key={i} style={{flex:1,height:3,borderRadius:99,background:i<idx?T.am:i===idx?"rgba(239,159,39,0.4)":"rgba(239,159,39,0.12)",transition:"background 0.5s"}}/>))}</div>);}

function Portrait({p,T}){return(<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1rem"}}><div style={{width:36,height:36,borderRadius:"50%",background:p.bg||"rgba(127,119,221,0.15)",border:`0.5px solid ${T.ab}`,display:"flex",alignItems:"center",justifyContent:"center"}}><i className={`ti ${p.ic}`} style={{fontSize:16,color:p.cl}} aria-hidden="true"/></div><span style={{fontSize:12,color:T.mt,fontFamily:"Georgia,serif",fontStyle:"italic"}}>{p.nm}</span></div>);}

function AchToast({ach,T,onClose}){useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t);},[]);return(<div style={{position:"fixed",top:20,right:20,zIndex:999,background:T.sf,border:`0.5px solid ${T.am}`,borderRadius:8,padding:"0.75rem 1rem",maxWidth:240,boxShadow:"none"}}><div style={{display:"flex",alignItems:"center",gap:8}}><i className={`ti ${ach.icon}`} style={{fontSize:18,color:T.am}} aria-hidden="true"/><div><div style={{fontSize:12,color:T.am,fontWeight:500}}>{ach.nm}</div><div style={{fontSize:11,color:T.mt}}>{ach.desc}</div></div></div></div>);}

function TimerBar({secs,max,T}){const pct=Math.round((secs/max)*100);const cl=secs<10?T.cr:secs<20?T.am:T.gn;return(<div style={{marginBottom:"0.75rem"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:cl,fontFamily:"Georgia,serif"}}><i className="ti ti-clock" style={{fontSize:11,marginRight:4}} aria-hidden="true"/>Tempo</span><span style={{fontSize:13,fontWeight:500,color:cl}}>{secs}s</span></div><div style={{height:4,background:T.al,borderRadius:99,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:cl,transition:"width 1s linear",borderRadius:99}}/></div></div>);}

// ── MAP SCREEN ──────────────────────────────────────────────
function MapScreen({scenes,inventory,onJump,onBack,T}){
  return(<div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>Voltar</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>Mapa do Reino do Código</p></div>
  <div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"1rem",position:"relative",overflow:"hidden"}}>
    <svg viewBox="0 0 100 100" style={{width:"100%",height:"auto",display:"block"}} aria-label="Mapa do reino">
      <rect width="100" height="100" fill={T.bg} rx="4"/>
      <text x="50" y="8" textAnchor="middle" fontSize="3.5" fill={T.am} fontFamily="Georgia,serif">Reino do Código</text>
      {scenes.map((sc,i)=>{if(i===0)return null;const prev=scenes[i-1];return(<line key={`l${i}`} x1={prev.mapPos.x} y1={prev.mapPos.y} x2={sc.mapPos.x} y2={sc.mapPos.y} stroke={T.ab} strokeWidth="0.5"/>);})}
      {scenes.map((sc,i)=>{const done=inventory.find(s=>s.id===sc.id);const clr=done?T.gn:T.mt;return(<g key={sc.id} onClick={()=>onJump(i)} style={{cursor:"pointer"}}><circle cx={sc.mapPos.x} cy={sc.mapPos.y} r="3.5" fill={done?T.gn:T.sf} stroke={done?T.gn:T.ab} strokeWidth="0.5"/><text x={sc.mapPos.x} y={sc.mapPos.y-5} textAnchor="middle" fontSize="2.2" fill={clr} fontFamily="Georgia,serif">{sc.ch}</text>{done&&<text x={sc.mapPos.x} y={sc.mapPos.y+0.8} textAnchor="middle" fontSize="2.5" fill={T.bg}>✓</text>}</g>);})}
    </svg>
    <p style={{fontSize:11,color:T.mt,textAlign:"center",marginTop:"0.5rem",fontFamily:"Georgia,serif"}}>Clique em um capítulo para revisitá-lo</p>
  </div></div>);
}

// ── ACHIEVEMENTS SCREEN ─────────────────────────────────────
function AchScreen({unlocked,T,onBack}){return(<div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>Voltar</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>Conquistas</p></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:8}}>{ACH.map(a=>{const got=unlocked.includes(a.id);return(<div key={a.id} style={{background:got?T.al:T.sf,border:`0.5px solid ${got?T.am:T.ab}`,borderRadius:8,padding:"0.85rem",opacity:got?1:0.45}}><i className={`ti ${a.icon}`} style={{fontSize:20,color:got?T.am:T.mt,display:"block",marginBottom:6}} aria-hidden="true"/><div style={{fontSize:13,fontWeight:500,color:T.tx,marginBottom:3}}>{a.nm}</div><div style={{fontSize:11,color:T.mt}}>{a.desc}</div>{got&&<div style={{fontSize:10,color:T.gn,marginTop:5}}><i className="ti ti-check" style={{fontSize:10,marginRight:3}} aria-hidden="true"/>Desbloqueado</div>}</div>);})}</div></div>);}

// ── LEADERBOARD SCREEN ──────────────────────────────────────
function LeaderBoard({playerName,T,onBack}){
  const [scores,setScores]=useState(()=>{try{return JSON.parse(localStorage.getItem("tdc_lb")||"[]");}catch{return [];}});
  return(<div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>Voltar</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>Placar de Líderes</p></div>
  {scores.length===0?<p style={{color:T.mt,fontFamily:"Georgia,serif",fontSize:13}}>Nenhuma partida registrada ainda. Complete o jogo para aparecer aqui!</p>:
  <div style={{display:"flex",flexDirection:"column",gap:6}}>{scores.slice(0,10).map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,background:s.name===playerName?T.al:T.sf,border:`0.5px solid ${s.name===playerName?T.am:T.ab}`,borderRadius:8,padding:"0.75rem 1rem"}}><span style={{fontSize:16,fontWeight:500,color:T.am,minWidth:24}}>#{i+1}</span><div style={{flex:1}}><div style={{fontSize:13,color:T.tx}}>{s.name}</div><div style={{fontSize:11,color:T.mt}}>{s.mode} · {s.difficulty} · {new Date(s.date).toLocaleDateString("pt-BR")}</div></div><span style={{fontSize:15,fontWeight:500,color:T.am}}>{s.score}pts</span></div>)}</div>}
  </div>);
}

// ── PROFILE SCREEN ──────────────────────────────────────────
function ProfileScreen({name,score,maxScore,learned,unlocked,inventory,difficulty,mode,T,onBack}){
  const pct=Math.round((score/maxScore)*100);
  const rank=pct>=90?"Arquimago do Código":pct>=70?"Desenvolvedor Sênior":pct>=50?"Desenvolvedor Júnior":"Aprendiz Promissor";
  const today=new Date().toLocaleDateString("pt-BR");
  const dlCard=()=>{const t=`TERRAS DO CÓDIGO — Cartão de Desenvolvedor\n${"─".repeat(40)}\nNome: ${name}\nRank: ${rank}\nPontuação: ${score}/${maxScore} (${pct}%)\nModo: ${mode} · Dificuldade: ${difficulty}\nConceitos dominados: ${learned.map(l=>l.nm||l.name).join(", ")}\nConquistas: ${unlocked.length}/${ACH.length}\nData: ${today}\n${"─".repeat(40)}\nterrasDocodigo.dev`;const b=new Blob([t],{type:"text/plain"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="perfil-desenvolvedor.txt";a.click();};
  return(<div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>Voltar</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>Perfil de Desenvolvedor</p></div>
  <div style={{background:T.sf,border:`0.5px solid ${T.am}`,borderRadius:12,padding:"1.5rem",marginBottom:"1rem"}}>
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:"1.25rem"}}>
      <div style={{width:52,height:52,borderRadius:"50%",background:T.al,border:`0.5px solid ${T.am}`,display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ti ti-user-circle" style={{fontSize:26,color:T.am}} aria-hidden="true"/></div>
      <div><div style={{fontSize:"1.2rem",color:T.tx,fontFamily:"Georgia,serif"}}>{name||"Desenvolvedor"}</div><div style={{fontSize:11,color:T.am,letterSpacing:2}}>{rank.toUpperCase()}</div></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:"1.25rem"}}>
      {[["Pontuação",`${score}/${maxScore}`],["Aproveitamento",`${pct}%`],["Conquistas",`${unlocked.length}/${ACH.length}`]].map(([l,v])=>(<div key={l} style={{background:T.bg,borderRadius:6,padding:"0.6rem",textAlign:"center"}}><div style={{fontSize:18,fontWeight:500,color:T.am}}>{v}</div><div style={{fontSize:10,color:T.mt}}>{l}</div></div>))}
    </div>
    <div style={{marginBottom:"1rem"}}><p style={{fontSize:10,letterSpacing:2,color:T.mt,textTransform:"uppercase",marginBottom:6}}>Conceitos dominados</p><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{learned.map((c,i)=>(<span key={i} style={{fontSize:11,background:T.al,border:`0.5px solid ${T.ab}`,color:T.am,padding:"2px 10px",borderRadius:4}}>{c.nm||c.name}</span>))}</div></div>
    <div style={{marginBottom:"1rem"}}><p style={{fontSize:10,letterSpacing:2,color:T.mt,textTransform:"uppercase",marginBottom:6}}>Inventário ({inventory.length} itens)</p><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{inventory.map((s,i)=>(<span key={i} style={{fontSize:11,color:T.mt,display:"flex",alignItems:"center",gap:4}}><i className={`ti ${s.item.icon}`} style={{fontSize:12,color:T.am}} aria-hidden="true"/>{s.item.name}</span>))}</div></div>
    <div style={{fontSize:10,color:T.mt,textAlign:"right"}}>{today} · {mode} · {difficulty}</div>
  </div>
  <NBtn onClick={dlCard} T={T}><i className="ti ti-download" style={{fontSize:12,marginRight:6}} aria-hidden="true"/>Baixar cartão (.txt)</NBtn>
  </div>);}

// ── CHEATSHEET DOWNLOAD ─────────────────────────────────────
function dlCheatsheet(learned){
  const lines=["TERRAS DO CÓDIGO — Cheatsheet de Programação","=".repeat(50),""];
  learned.forEach(c=>{lines.push(`▸ ${(c.nm||c.name).toUpperCase()}`);lines.push(c.sum);lines.push("");lines.push("Python:");lines.push(c.py||"");lines.push("");lines.push("JavaScript:");lines.push(c.js||"");lines.push("-".repeat(50));lines.push("");});
  const b=new Blob([lines.join("\n")],{type:"text/plain"});
  const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="cheatsheet-programacao.txt";a.click();
}

// ── SANDBOX SCREEN ──────────────────────────────────────────
function Sandbox({scene,language,T,onNext,onAchieve}){
  const initCode=language==="js"?scene.concept.js:scene.concept.py;
  const[code,setCode]=useState(initCode);
  const[out,setOut]=useState("");
  const[running,setRunning]=useState(false);
  const[skulptReady,setSkulptReady]=useState(!!window.Sk);
  const[lang,setLang]=useState(language==="js"?"js":"py");

  useEffect(()=>{
    if(!window.Sk){
      const s1=document.createElement("script");
      s1.src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js";
      s1.onload=()=>{
        const s2=document.createElement("script");
        s2.src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js";
        s2.onload=()=>setSkulptReady(true);
        document.head.appendChild(s2);
      };
      document.head.appendChild(s1);
    } else setSkulptReady(true);
  },[]);

  useEffect(()=>{setCode(lang==="js"?scene.concept.js:scene.concept.py);},[lang]);

  const runJS=()=>{
    let logs=[];
    const orig=console.log;
    console.log=(...a)=>{logs.push(a.map(x=>typeof x==="object"?JSON.stringify(x):String(x)).join(" "));orig(...a);};
    try{new Function(code)();setOut(logs.join("\n")||"(sem output — sem console.log?)");}
    catch(e){setOut("Erro: "+e.message);}
    finally{console.log=orig;}
  };

  const runPY=()=>{
    if(!window.Sk){setOut("Skulpt ainda carregando... aguarde e tente novamente.");return;}
    let o="";
    window.Sk.configure({
      output:t=>{o+=t;},
      read:f=>{if(window.Sk.builtinFiles?.files[f])return window.Sk.builtinFiles.files[f];throw f+" não encontrado";}
    });
    window.Sk.misceval.asyncToPromise(()=>window.Sk.importMainWithBody("<stdin>",false,code,true))
      .then(()=>setOut(o||"(sem output — sem print?"))
      .catch(e=>setOut("Erro: "+e.toString()))
      .finally(()=>setRunning(false));
  };

  const run=()=>{
    setRunning(true);setOut("");
    onAchieve("sandbox_a");
    if(lang==="js"){runJS();setRunning(false);}
    else runPY();
  };

  return(<div>
    <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.75rem"}}><i className="ti ti-terminal-2" style={{fontSize:13,marginRight:6,verticalAlign:"-1px"}} aria-hidden="true"/>Sandbox — Execute código real</p>
    <div style={{display:"flex",gap:6,marginBottom:8}}>
      {[["py","Python"],["js","JavaScript"]].map(([k,l])=>(<button key={k} onClick={()=>setLang(k)} style={{background:lang===k?T.al:"transparent",border:`0.5px solid ${lang===k?T.am:T.ab}`,color:lang===k?T.am:T.mt,padding:"3px 12px",borderRadius:4,cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif"}}>{l}</button>))}
      {lang==="py"&&!skulptReady&&<span style={{fontSize:10,color:T.mt,alignSelf:"center",marginLeft:4}}>carregando Skulpt...</span>}
    </div>
    <textarea value={code} onChange={e=>setCode(e.target.value)} style={{width:"100%",background:T.cb,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.9rem 1.1rem",fontFamily:"Courier New,monospace",fontSize:"0.8rem",color:"#b8dfa0",lineHeight:1.78,resize:"vertical",minHeight:140,boxSizing:"border-box",outline:"none",marginBottom:8}}/>
    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:"0.75rem"}}>
      <button onClick={run} disabled={running||(lang==="py"&&!skulptReady)} style={{background:T.al,border:`0.5px solid ${T.am}`,color:T.am,padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif",display:"flex",alignItems:"center",gap:6}}><i className="ti ti-player-play" style={{fontSize:13}} aria-hidden="true"/>{running?"Executando...":"Executar"}</button>
      <span style={{fontSize:11,color:T.mt}}>Modifique e execute o código livremente!</span>
    </div>
    {out&&<pre style={{background:T.cb,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.85rem 1.1rem",fontSize:"0.78rem",color:out.startsWith("Erro")?T.cr:"#b8dfa0",fontFamily:"Courier New,monospace",lineHeight:1.7,whiteSpace:"pre-wrap",marginBottom:"1rem",maxHeight:160,overflowY:"auto"}}>{out}</pre>}
    <NBtn onClick={onNext} T={T}>Ver quiz →</NBtn>
  </div>);}

// ── INTRO / SETUP ────────────────────────────────────────────
function Intro({onStart,onDaily,onMulti,settings,setSettings}){
  const{theme,difficulty,language,p1,p2}=settings;
  const T=TH[theme];
  const dailyIdx=(()=>{const d=new Date().toDateString();let h=0;for(const c of d)h=(h*31+c.charCodeAt(0))%SCENES.length;return h;})();
  return(<div style={{paddingTop:"2.5rem",paddingBottom:"1rem"}}>
    <div style={{textAlign:"center",marginBottom:"2rem"}}>
      <i className="ti ti-sword" style={{fontSize:44,color:T.am,display:"block",marginBottom:"1rem"}} aria-hidden="true"/>
      <p style={{fontSize:10,letterSpacing:4,color:T.am,textTransform:"uppercase",marginBottom:"0.5rem"}}>Uma aventura de programação</p>
      <h1 style={{fontSize:"2.1rem",fontWeight:"normal",color:T.tx,marginBottom:"0.75rem",letterSpacing:"1.5px",fontFamily:"Georgia,serif"}}>Terras do Código</h1>
      <p style={{fontSize:"0.88rem",color:T.mt,maxWidth:400,margin:"0 auto",lineHeight:1.85,fontFamily:"Georgia,serif"}}>17 capítulos · quiz · sandbox real · mapa · conquistas · multiplayer · mais</p>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:"1.5rem"}}>
      {[["Tema visual","theme",[["dark","Grimório Sombrio"],["light","Pergaminho Antigo"],["cyber","Neon Futuro"]]],
        ["Dificuldade","difficulty",[["iniciante","Iniciante"],["desafiador","Desafiador"]]],
        ["Linguagem de código","language",[["py","Python"],["js","JavaScript"],["both","Ambas"]]]].map(([label,key,opts])=>(
        <div key={key} style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"1rem"}}>
          <p style={{fontSize:10,letterSpacing:2,color:T.am,textTransform:"uppercase",marginBottom:"0.65rem"}}>{label}</p>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {opts.map(([v,l])=>(<button key={v} onClick={()=>setSettings(s=>({...s,[key]:v}))} style={{background:settings[key]===v?T.al:"transparent",border:`0.5px solid ${settings[key]===v?T.am:T.ab}`,color:settings[key]===v?T.am:T.mt,padding:"5px 10px",borderRadius:4,cursor:"pointer",fontSize:12,fontFamily:"Georgia,serif",textAlign:"left"}}>{settings[key]===v&&<i className="ti ti-check" style={{fontSize:11,marginRight:6}} aria-hidden="true"/>}{l}</button>))}
          </div>
        </div>
      ))}
    </div>

    <div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"1rem",marginBottom:"1.5rem"}}>
      <p style={{fontSize:10,letterSpacing:2,color:T.am,textTransform:"uppercase",marginBottom:"0.65rem"}}>Nome do jogador</p>
      <input value={p1} onChange={e=>setSettings(s=>({...s,p1:e.target.value}))} placeholder="Byte" style={{background:T.cb,border:`0.5px solid ${T.ab}`,color:T.tx,padding:"6px 10px",borderRadius:4,fontSize:13,fontFamily:"Georgia,serif",outline:"none",width:"100%",boxSizing:"border-box"}}/>
    </div>

    <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center"}}>
      <NBtn onClick={onStart} T={T}>Jogar solo →</NBtn>
      <NBtn onClick={onMulti} T={T}><i className="ti ti-users" style={{fontSize:12,marginRight:6}} aria-hidden="true"/>Multiplayer →</NBtn>
      <NBtn onClick={()=>onDaily(dailyIdx)} T={T}><i className="ti ti-calendar" style={{fontSize:12,marginRight:6}} aria-hidden="true"/>Desafio diário →</NBtn>
    </div>
    <p style={{fontSize:11,color:T.mt,textAlign:"center",marginTop:"0.75rem",fontFamily:"Georgia,serif"}}>Desafio de hoje: {SCENES[dailyIdx].title}</p>
  </div>);}

// ── MULTIPLAYER SETUP ────────────────────────────────────────
function MultiSetup({T,settings,setSettings,onStart,onBack}){
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>Voltar</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>Modo Multiplayer</p></div>
    <p style={{fontSize:"0.9rem",color:T.tx,marginBottom:"1.5rem",fontFamily:"Georgia,serif",lineHeight:1.7}}>Dois jogadores competem no mesmo dispositivo. Cada um joga todos os 17 capítulos. Quem terminar com mais pontos vence!</p>
    {[["Jogador 1","p1"],["Jogador 2","p2"]].map(([label,key])=>(<div key={key} style={{marginBottom:"1rem"}}><p style={{fontSize:11,color:T.am,marginBottom:5,fontFamily:"Georgia,serif"}}>{label}</p><input value={settings[key]} onChange={e=>setSettings(s=>({...s,[key]:e.target.value}))} placeholder={label} style={{background:T.sf,border:`0.5px solid ${T.ab}`,color:T.tx,padding:"8px 12px",borderRadius:4,fontSize:13,fontFamily:"Georgia,serif",outline:"none",width:"100%",boxSizing:"border-box"}}/></div>))}
    <NBtn onClick={onStart} T={T}><i className="ti ti-users" style={{fontSize:12,marginRight:6}} aria-hidden="true"/>Iniciar →</NBtn>
  </div>);}

// ── PLAYER SWITCH ────────────────────────────────────────────
function PlayerSwitch({next,score,T,onContinue}){return(<div style={{textAlign:"center",paddingTop:"2rem"}}><i className="ti ti-arrow-left-right" style={{fontSize:40,color:T.am,display:"block",marginBottom:"1rem"}} aria-hidden="true"/><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.5rem"}}>Fim do turno</p><p style={{fontSize:"1.1rem",color:T.tx,marginBottom:"0.5rem",fontFamily:"Georgia,serif"}}>Pontuação: {score} pts</p><p style={{fontSize:"0.9rem",color:T.mt,marginBottom:"2rem",fontFamily:"Georgia,serif"}}>Passe o dispositivo para <strong style={{color:T.am}}>{next}</strong></p><NBtn onClick={onContinue} T={T}>Iniciar turno de {next} →</NBtn></div>);}

// ── READING PHASE ────────────────────────────────────────────
function Reading({scene,difficulty,hintShown,onHint,onPick,T,hintCost,timerSecs,timerMax,isSpeed}){
  const narr=difficulty==="desafiador"?scene.narrH:scene.narr;
  return(<div>
    <div style={{marginBottom:"1.25rem"}}>
      <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.3rem"}}><i className={`ti ${scene.icon}`} style={{fontSize:13,marginRight:6,verticalAlign:"-1px"}} aria-hidden="true"/>{scene.ch}</p>
      <h2 style={{fontSize:"1.3rem",fontWeight:"normal",color:T.tx,margin:0,fontFamily:"Georgia,serif"}}>{scene.title}</h2>
    </div>
    {scene.portrait&&<Portrait p={scene.portrait} T={T}/>}
    {isSpeed&&<TimerBar secs={timerSecs} max={timerMax} T={T}/>}
    <div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"1.4rem 1.5rem",marginBottom:"1.25rem",lineHeight:1.85,fontSize:"0.92rem",whiteSpace:"pre-line",color:T.tx,fontFamily:"Georgia,serif"}}>{narr}</div>
    {!hintShown?(<button onClick={onHint} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:12,fontFamily:"Georgia,serif",marginBottom:"1rem"}}><i className="ti ti-bulb" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{hintCost>0?`Dica (−${hintCost} pts)`:"Dica (grátis)"}</button>):(<div style={{background:`rgba(239,159,39,0.06)`,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.6rem 0.9rem",marginBottom:"1rem",fontSize:12,color:T.am,fontFamily:"Georgia,serif",lineHeight:1.6}}><i className="ti ti-bulb" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{scene.hint}</div>)}
    <p style={{fontSize:10,letterSpacing:3,color:T.mt,textTransform:"uppercase",marginBottom:"0.65rem"}}>O que você faz?</p>
    <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>{scene.choices.map((c,i)=><CBtn key={i} onClick={()=>onPick(i)} T={T}>{c.text}</CBtn>)}</div>
  </div>);}

// ── CHOSEN / BRANCH ──────────────────────────────────────────
function Chosen({choice,T,onContinue}){const g=choice.good;const clr=g?T.gn:T.cr;const cbd=g?"rgba(93,202,165,.22)":"rgba(216,90,48,.22)";return(<div><div style={{marginBottom:"1rem"}}><span style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:clr,background:g?"rgba(93,202,165,.07)":"rgba(216,90,48,.07)",border:`0.5px solid ${cbd}`,padding:"3px 10px",borderRadius:4}}><i className={`ti ${g?"ti-check":"ti-alert-triangle"}`} style={{fontSize:12,marginRight:5,verticalAlign:"-1px"}} aria-hidden="true"/>{g?`Boa escolha! +10 pts`:"Poderia ser melhor"}</span></div><div style={{background:T.sf,border:`0.5px solid ${cbd}`,borderLeft:`3px solid ${clr}`,borderRadius:8,padding:"1.4rem 1.5rem",marginBottom:"1.5rem",lineHeight:1.85,fontSize:"0.92rem",whiteSpace:"pre-line",color:T.tx,fontFamily:"Georgia,serif"}}>{choice.cons}</div><NBtn onClick={onContinue} T={T}>{choice.branch?"Continuar →":"Ver conceito →"}</NBtn></div>);}

function BranchScene({choice,T,onContinue}){return(<div><div style={{marginBottom:"1rem"}}><span style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:T.am,background:T.al,border:`0.5px solid ${T.ab}`,padding:"3px 10px",borderRadius:4}}><i className="ti ti-rotate" style={{fontSize:12,marginRight:5,verticalAlign:"-1px"}} aria-hidden="true"/>Desvio narrativo</span></div><div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderLeft:`3px solid ${T.am}`,borderRadius:8,padding:"1.4rem 1.5rem",marginBottom:"1.5rem",lineHeight:1.85,fontSize:"0.92rem",whiteSpace:"pre-line",color:T.tx,fontFamily:"Georgia,serif"}}>{choice.branch}</div><NBtn onClick={onContinue} T={T}>Ver conceito →</NBtn></div>);}

// ── CONCEPT CARD ─────────────────────────────────────────────
function ConceptCard({scene,language,T,onNext}){
  const c=scene.concept;
  const initLang=language==="js"?"js":"py";
  const[lang,setLang]=useState(initLang);
  const[py,setPy]=useState(c.py);
  const[js,setJs]=useState(c.js);
  const curCode=lang==="py"?py:js;
  const setCode=lang==="py"?setPy:setJs;
  return(<div>
    <div style={{border:`0.5px solid ${c.bd}`,background:c.bg,borderRadius:8,padding:"1.5rem",marginBottom:"1.5rem"}}>
      <p style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:c.cl,marginBottom:"0.4rem"}}><i className="ti ti-bulb" style={{fontSize:13,marginRight:6,verticalAlign:"-1px"}} aria-hidden="true"/>Conceito aprendido</p>
      <h3 style={{fontSize:"1.2rem",fontWeight:"normal",color:T.tx,marginBottom:"0.85rem",fontFamily:"Georgia,serif"}}>{c.nm}</h3>
      <p style={{fontSize:"0.88rem",color:T.tx,lineHeight:1.78,marginBottom:"1.25rem",fontFamily:"Georgia,serif"}}>{c.sum}</p>
      <div style={{display:"flex",gap:6,marginBottom:8,alignItems:"center"}}>
        {(language==="both"?[["py","Python"],["js","JavaScript"]]:language==="js"?[["js","JavaScript"]]:[["py","Python"]]).map(([k,l])=>(<button key={k} onClick={()=>setLang(k)} style={{background:lang===k?T.al:"transparent",border:`0.5px solid ${lang===k?T.am:T.ab}`,color:lang===k?T.am:T.mt,padding:"3px 12px",borderRadius:4,cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif"}}>{l}</button>))}
        <button onClick={()=>setCode(lang==="py"?c.py:c.js)} style={{marginLeft:"auto",background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,padding:"3px 10px",borderRadius:4,cursor:"pointer",fontSize:10,fontFamily:"Georgia,serif"}}><i className="ti ti-refresh" style={{fontSize:10,marginRight:4}} aria-hidden="true"/>Resetar</button>
      </div>
      <textarea value={curCode} onChange={e=>setCode(e.target.value)} style={{width:"100%",background:T.cb,border:`0.5px solid rgba(239,159,39,.1)`,borderRadius:6,padding:"0.9rem 1.1rem",fontFamily:"Courier New,monospace",fontSize:"0.79rem",color:"#b8dfa0",lineHeight:1.78,resize:"vertical",minHeight:130,boxSizing:"border-box",outline:"none"}}/>
      <p style={{fontSize:11,color:T.mt,marginTop:5,fontFamily:"Georgia,serif"}}><i className="ti ti-pencil" style={{fontSize:10,marginRight:4}} aria-hidden="true"/>Edite o código para praticar!</p>
    </div>
    <NBtn onClick={onNext} T={T}>Sandbox — executar código →</NBtn>
  </div>);}

// ── QUIZ ─────────────────────────────────────────────────────
function Quiz({scene,isLast,T,onSubmit}){
  const[sel,setSel]=useState(null);const[rev,setRev]=useState(false);const q=scene.quiz;const ok=sel===q.ok;
  return(<div>
    <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.5rem"}}><i className="ti ti-help-circle" style={{fontSize:13,marginRight:6,verticalAlign:"-1px"}} aria-hidden="true"/>Quiz rápido</p>
    <p style={{fontSize:"0.96rem",color:T.tx,marginBottom:"1.25rem",fontFamily:"Georgia,serif",lineHeight:1.7}}>{q.q}</p>
    <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",marginBottom:"1rem"}}>{q.opts.map((opt,i)=>{let bd=T.ab,bg="transparent",tc=T.tx;if(rev){if(i===q.ok){bd="rgba(93,202,165,.5)";bg="rgba(93,202,165,.08)";tc=T.gn;}else if(i===sel){bd="rgba(216,90,48,.5)";bg="rgba(216,90,48,.08)";tc=T.cr;}}else if(i===sel){bd=T.am;bg=T.al;}return(<button key={i} onClick={()=>!rev&&setSel(i)} style={{background:bg,border:`0.5px solid ${bd}`,color:tc,padding:"0.75rem 1rem",textAlign:"left",cursor:rev?"default":"pointer",borderRadius:8,fontSize:"0.9rem",fontFamily:"Georgia,serif",lineHeight:1.5,transition:"all 0.2s"}}>{rev&&i===q.ok&&<i className="ti ti-check" style={{fontSize:12,marginRight:8,color:T.gn}} aria-hidden="true"/>}{rev&&i===sel&&i!==q.ok&&<i className="ti ti-x" style={{fontSize:12,marginRight:8,color:T.cr}} aria-hidden="true"/>}{opt}</button>);})}
    </div>
    {!rev?(<NBtn onClick={()=>sel!==null&&setRev(true)} disabled={sel===null} T={T}>Verificar →</NBtn>):(<div><p style={{fontSize:"0.88rem",color:ok?T.gn:T.mt,marginBottom:"1rem",fontFamily:"Georgia,serif"}}>{ok?"+5 pontos! Correto!":"Não desta vez — mas agora você sabe!"}</p><NBtn onClick={()=>onSubmit(sel)} T={T}>{isLast?"Ver resultado final →":"Próximo capítulo →"}</NBtn></div>)}
  </div>);}

// ── GLOSSARY PANEL ───────────────────────────────────────────
function Glossary({learned,open,onToggle,T}){return(<div style={{borderTop:`0.5px solid ${T.ab}`,marginTop:"1.5rem"}}><button onClick={onToggle} style={{width:"100%",background:"transparent",border:"none",color:T.mt,padding:"0.75rem 0",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontSize:12,fontFamily:"Georgia,serif",letterSpacing:1}}><i className="ti ti-book" style={{fontSize:14,color:T.am}} aria-hidden="true"/>Grimório do Desenvolvedor ({learned.length} conceitos)<i className={`ti ${open?"ti-chevron-up":"ti-chevron-down"}`} style={{fontSize:12,marginLeft:"auto"}} aria-hidden="true"/></button>{open&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:8,paddingBottom:"1.5rem"}}>{learned.map((c,i)=>(<div key={i} style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"0.75rem"}}><div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:c.cl,marginBottom:4}}>{c.nm}</div><div style={{fontSize:12,color:T.mt,lineHeight:1.6}}>{c.sum}</div></div>))}{!learned.length&&<p style={{fontSize:13,color:T.mt,fontFamily:"Georgia,serif"}}>Conclua capítulos para ver conceitos aqui.</p>}</div>}</div>);}

// ── END SCREEN ───────────────────────────────────────────────
function End({players,currentP,mode,T,learned,achievements,inventory,onRestart,onProfile,onLB,onChapters,settings}){
  const p=players[currentP];const other=mode==="multi"?players[1-currentP]:null;
  const pct=Math.round((p.score/(SCENES.length*15))*100);
  const rank=pct>=90?"Arquimago do Código":pct>=70?"Desenvolvedor Sênior":pct>=50?"Desenvolvedor Júnior":"Aprendiz Promissor";
  return(<div style={{textAlign:"center",paddingTop:"2rem"}}>
    <i className="ti ti-trophy" style={{fontSize:48,color:T.am,display:"block",marginBottom:"1rem"}} aria-hidden="true"/>
    <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.5rem"}}>Missão cumprida!</p>
    <h2 style={{fontSize:"1.8rem",fontWeight:"normal",color:T.tx,marginBottom:"0.5rem",fontFamily:"Georgia,serif"}}>{rank}</h2>
    <p style={{fontSize:"0.9rem",color:T.mt,marginBottom:"1.5rem",fontFamily:"Georgia,serif"}}>{p.name||"Byte"} · {p.score} pts · {pct}%</p>
    {other&&<div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"0.85rem",marginBottom:"1.5rem",fontSize:"0.9rem",color:T.tx,fontFamily:"Georgia,serif"}}><i className="ti ti-users" style={{fontSize:14,marginRight:8,color:T.am}} aria-hidden="true"/>{other.name}: {other.score} pts {p.score>other.score?"— Você venceu! 🏆":p.score<other.score?"— Vitória deles!":"— Empate!"}</div>}
    <div style={{height:8,background:T.al,borderRadius:99,overflow:"hidden",maxWidth:300,margin:"0 auto 1.5rem"}}><div style={{width:`${pct}%`,height:"100%",background:pct>=70?T.gn:T.am,borderRadius:99}}/></div>
    <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginBottom:"1.75rem"}}>{learned.map((c,i)=>(<span key={i} style={{background:T.al,border:`0.5px solid ${T.ab}`,color:T.am,padding:"3px 12px",borderRadius:4,fontSize:11}}><i className="ti ti-check" style={{fontSize:10,marginRight:4}} aria-hidden="true"/>{c.nm}</span>))}</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:"1rem"}}>
      <NBtn onClick={onProfile} T={T}><i className="ti ti-id-badge" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>Perfil</NBtn>
      <NBtn onClick={onLB} T={T}><i className="ti ti-trophy" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>Placar</NBtn>
      <NBtn onClick={()=>dlCheatsheet(learned)} T={T}><i className="ti ti-download" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>Cheatsheet</NBtn>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}><NBtn onClick={onRestart} T={T}>Jogar novamente</NBtn><NBtn onClick={onChapters} T={T}>Revisar mapa</NBtn></div>
    <p style={{fontSize:12,color:T.mt,marginTop:"1.5rem",fontFamily:"Georgia,serif"}}>Continue sua jornada aprendendo Python, JavaScript ou a linguagem que preferir!</p>
  </div>);}

// ══ MAIN APP ══════════════════════════════════════════════════
export default function App(){
  const[settings,setSettings]=useState({theme:"dark",difficulty:"iniciante",language:"py",p1:"Byte",p2:"Pixel"});
  const T=TH[settings.theme];
  const audioRef=useRef(null);
  const[phase,setPhase]=useState("intro");
  const[idx,setIdx]=useState(0);
  const[choiceIdx,setChoiceIdx]=useState(null);
  const[players,setPlayers]=useState([{name:"Byte",score:0,achievements:[],inventory:[]},{name:"Pixel",score:0,achievements:[],inventory:[]}]);
  const[currentP,setCurrentP]=useState(0);
  const[mode,setMode]=useState("solo");
  const[learned,setLearned]=useState([]);
  const[glossary,setGlossary]=useState(false);
  const[hintShown,setHintShown]=useState(false);
  const[timerSecs,setTimerSecs]=useState(30);
  const[timerMax]=useState(30);
  const[quizStreak,setQuizStreak]=useState(0);
  const[toastAch,setToastAch]=useState(null);
  const[animKey,setAnimKey]=useState(0);
  const[chapterStart,setChapterStart]=useState(Date.now());
  const timerRef=useRef(null);
  const isSpeed=mode==="speed";
  const isMulti=mode==="multi";
  const scene=SCENES[idx];
  const choice=scene&&choiceIdx!==null?scene.choices[choiceIdx]:null;
  const hintCost=settings.difficulty==="desafiador"?2:0;
  const p=players[currentP];

  // Load save
  useEffect(()=>{
    try{
      const sv=JSON.parse(localStorage.getItem("tdc_save")||"null");
      if(sv&&sv.phase!=="intro"&&sv.phase!=="end"){
        setPhase(sv.phase||"intro");setIdx(sv.idx||0);setLearned(sv.learned||[]);
        setPlayers(sv.players||players);setSettings(sv.settings||settings);
      }
    }catch{}
    audioRef.current=mkAudio();
  },[]);

  // Auto-save
  useEffect(()=>{
    if(phase!=="intro")try{localStorage.setItem("tdc_save",JSON.stringify({phase,idx,learned,players,settings}));}catch{}
  },[phase,idx,learned]);

  // Timer for speedrun
  useEffect(()=>{
    if(isSpeed&&phase==="reading"){
      setTimerSecs(timerMax);
      timerRef.current=setInterval(()=>{
        setTimerSecs(s=>{
          if(s<=1){clearInterval(timerRef.current);audioRef.current?.err();pick(Math.floor(Math.random()*scene.choices.length));return 0;}
          if(s<=10)audioRef.current?.tick();
          return s-1;
        });
      },1000);
    }
    return()=>clearInterval(timerRef.current);
  },[phase,idx,isSpeed]);

  const go=(ph,ni)=>{if(ni!==undefined)setIdx(ni);setPhase(ph);setAnimKey(k=>k+1);};

  const achieve=(id)=>{
    setPlayers(prev=>{const ps=[...prev];if(!ps[currentP].achievements.includes(id)){ps[currentP]={...ps[currentP],achievements:[...ps[currentP].achievements,id]};const a=ACH.find(x=>x.id===id);if(a)setToastAch(a);}return ps;});
  };

  const addScore=(n)=>setPlayers(prev=>{const ps=[...prev];ps[currentP]={...ps[currentP],score:ps[currentP].score+n};return ps;});

  const saveToLB=(score,name)=>{
    try{
      const lb=JSON.parse(localStorage.getItem("tdc_lb")||"[]");
      lb.push({name:name||"Byte",score,mode,difficulty:settings.difficulty,date:Date.now()});
      lb.sort((a,b)=>b.score-a.score);
      localStorage.setItem("tdc_lb",JSON.stringify(lb.slice(0,20)));
    }catch{}
  };

  const start=()=>{
    const nm=settings.p1||"Byte";
    setPlayers([{name:nm,score:0,achievements:[],inventory:[]},{name:settings.p2||"Pixel",score:0,achievements:[],inventory:[]}]);
    setMode("solo");setIdx(0);setLearned([]);setHintShown(false);setGlossary(false);setChapterStart(Date.now());go("reading",0);
  };

  const startMulti=()=>{
    setPlayers([{name:settings.p1||"Byte",score:0,achievements:[],inventory:[]},{name:settings.p2||"Pixel",score:0,achievements:[],inventory:[]}]);
    setMode("multi");setCurrentP(0);setIdx(0);setLearned([]);setHintShown(false);setChapterStart(Date.now());go("reading",0);
    achieve("multi");
  };

  const startDaily=(dailyIdx)=>{
    const nm=settings.p1||"Byte";
    setPlayers([{name:nm,score:0,achievements:[],inventory:[]},{name:settings.p2||"Pixel",score:0,achievements:[],inventory:[]}]);
    setMode("daily");setIdx(dailyIdx);setLearned([]);setHintShown(false);setChapterStart(Date.now());go("reading",dailyIdx);
  };

  const pick=(i)=>{
    clearInterval(timerRef.current);
    setChoiceIdx(i);
    const good=SCENES[idx].choices[i].good;
    if(good){addScore(10);audioRef.current?.ok();if(players[currentP].score===0)achieve("first_good");}
    else audioRef.current?.err();
    if(!hintShown)achieve("no_hints");
    const elapsed=(Date.now()-chapterStart)/1000;
    if(elapsed<25)achieve("speed");
    go("chosen");
  };

  const afterChosen=()=>{if(choice?.branch)go("branch");else go("concept");};

  const toSandbox=()=>go("sandbox");

  const toQuiz=()=>{
    // check if saw both languages
    if(settings.language==="both")achieve("polyglot");
    go("quiz");
  };

  const submitQuiz=(ans)=>{
    const correct=ans===scene.quiz.ok;
    if(correct){addScore(5);audioRef.current?.ok();const ns=quizStreak+1;setQuizStreak(ns);if(ns>=3)achieve("streak3");}
    else setQuizStreak(0);

    const newInv=p.inventory.find(s=>s.id===scene.id)?p.inventory:[...p.inventory,scene];
    setPlayers(prev=>{const ps=[...prev];ps[currentP]={...ps[currentP],inventory:newInv};return ps;});
    if(newInv.length>=6)achieve("collector");

    const newLearned=learned.find(l=>l.nm===scene.concept.nm)?learned:[...learned,{...scene.concept}];
    setLearned(newLearned);

    const ni=idx+1;
    const isLast=(mode==="daily")||(ni>=SCENES.length);

    if(isLast){
      if(players[currentP].score>=SCENES.length*10)achieve("flawless");
      if(mode==="daily")achieve("daily");
      saveToLB(players[currentP].score,players[currentP].name);
      audioRef.current?.win();
      if(mode==="multi"&&currentP===0){setCurrentP(1);setIdx(0);setHintShown(false);setChapterStart(Date.now());go("playerswitch");}
      else go("end");
    } else {
      setChoiceIdx(null);setHintShown(false);setChapterStart(Date.now());go("reading",ni);
    }
  };

  const showHeader=!["intro","multi-setup","end","profile","leaderboard","achievements","map","playerswitch"].includes(phase);

  return(<div style={{padding:"0.75rem 0"}}>
    <style>{`@keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.fi{animation:fi 0.28s ease}`}</style>
    {toastAch&&<AchToast ach={toastAch} T={T} onClose={()=>setToastAch(null)}/>}
    <div style={{background:T.bg,borderRadius:12,border:`0.5px solid ${T.ab}`,overflow:"hidden",minHeight:480}}>
      <h2 className="sr-only">Terras do Código — RPG de programação</h2>

      {showHeader&&<div style={{padding:"1.75rem 2rem 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"0.75rem"}}>
          <span style={{fontSize:11,color:T.am}}><i className="ti ti-star" style={{fontSize:12,marginRight:4}} aria-hidden="true"/>{p.score} pts</span>
          {isMulti&&<span style={{fontSize:11,color:T.mt}}>· {p.name}</span>}
          <span style={{fontSize:10,background:T.al,border:`0.5px solid ${T.ab}`,color:T.am,padding:"2px 7px",borderRadius:4}}>{settings.difficulty}</span>
          {isSpeed&&<span style={{fontSize:10,background:"rgba(216,90,48,.1)",border:"0.5px solid rgba(216,90,48,.22)",color:T.cr,padding:"2px 7px",borderRadius:4}}>Contrarrelógio</span>}
          <div style={{marginLeft:"auto",display:"flex",gap:6}}>
            {[["ti-map","map"],["ti-award","achievements"],["ti-trophy","leaderboard"]].map(([ic,ph])=>(<button key={ph} onClick={()=>go(ph)} title={ph} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,width:26,height:26,borderRadius:4,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className={`ti ${ic}`} style={{fontSize:13}} aria-hidden="true"/></button>))}
          </div>
        </div>
        <ProgBar idx={mode==="daily"?0:idx} total={mode==="daily"?1:SCENES.length} T={T}/>
        {p.inventory.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:"0.75rem"}}>{p.inventory.map((s,i)=>(<span key={i} title={s.item.name} style={{fontSize:10,color:T.mt,background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:4,padding:"2px 7px",display:"flex",alignItems:"center",gap:4}}><i className={`ti ${s.item.icon}`} style={{fontSize:11,color:T.am}} aria-hidden="true"/>{s.item.name}</span>))}</div>}
      </div>}

      <div key={animKey} className="fi" style={{padding:showHeader?"0 2rem 2rem":"2rem 2rem 2rem"}}>
        {phase==="intro"&&<Intro onStart={start} onDaily={startDaily} onMulti={()=>go("multi-setup")} settings={settings} setSettings={setSettings}/>}
        {phase==="multi-setup"&&<MultiSetup T={T} settings={settings} setSettings={setSettings} onStart={startMulti} onBack={()=>go("intro")}/>}
        {phase==="playerswitch"&&<PlayerSwitch next={players[1].name} score={players[0].score} T={T} onContinue={()=>{setHintShown(false);setChapterStart(Date.now());go("reading",0);}}/>}
        {phase==="reading"&&scene&&<Reading scene={scene} difficulty={settings.difficulty} hintShown={hintShown} onHint={()=>{if(hintCost>0)addScore(-hintCost);setHintShown(true);}} onPick={pick} T={T} hintCost={hintCost} timerSecs={timerSecs} timerMax={timerMax} isSpeed={isSpeed}/>}
        {phase==="chosen"&&choice&&<Chosen choice={choice} T={T} onContinue={afterChosen}/>}
        {phase==="branch"&&choice&&<BranchScene choice={choice} T={T} onContinue={()=>go("concept")}/>}
        {phase==="concept"&&scene&&<ConceptCard scene={scene} language={settings.language} T={T} onNext={toSandbox}/>}
        {phase==="sandbox"&&scene&&<Sandbox scene={scene} language={settings.language} T={T} onNext={toQuiz} onAchieve={achieve}/>}
        {phase==="quiz"&&scene&&<Quiz scene={scene} isLast={mode==="daily"||(idx===SCENES.length-1)} T={T} onSubmit={submitQuiz}/>}
        {phase==="map"&&<MapScreen scenes={SCENES} inventory={p.inventory} onJump={i=>{setChoiceIdx(null);setHintShown(false);setChapterStart(Date.now());go("reading",i);}} onBack={()=>go(idx>=0?"reading":"intro")} T={T}/>}
        {phase==="achievements"&&<AchScreen unlocked={p.achievements} T={T} onBack={()=>go(idx>=0?"reading":"intro")}/>}
        {phase==="leaderboard"&&<LeaderBoard playerName={p.name} T={T} onBack={()=>go(idx>=0?"reading":"end")}/>}
        {phase==="profile"&&<ProfileScreen name={p.name} score={p.score} maxScore={SCENES.length*15} learned={learned} unlocked={p.achievements} inventory={p.inventory} difficulty={settings.difficulty} mode={mode} T={T} onBack={()=>go("end")}/>}
        {phase==="end"&&<End players={players} currentP={currentP} mode={mode} T={T} learned={learned} achievements={p.achievements} inventory={p.inventory} onRestart={()=>{try{localStorage.removeItem("tdc_save");}catch{}setPhase("intro");setIdx(0);setLearned([]);setPlayers([{name:settings.p1||"Byte",score:0,achievements:[],inventory:[]},{name:settings.p2||"Pixel",score:0,achievements:[],inventory:[]}]);setCurrentP(0);setAnimKey(k=>k+1);}} onProfile={()=>go("profile")} onLB={()=>go("leaderboard")} onChapters={()=>go("map")} settings={settings}/>}
      </div>

      {showHeader&&<div style={{padding:"0 2rem"}}><Glossary learned={learned.map(c=>({nm:c.nm,cl:c.cl,sum:c.sum}))} open={glossary} onToggle={()=>setGlossary(g=>!g)} T={T}/></div>}
    </div>
  </div>);
}
