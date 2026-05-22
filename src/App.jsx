import { useState, useEffect, useRef, useCallback } from "react";

const TH={
  dark:{bg:"#1a1810",sf:"#22201a",cb:"#0e0b07",am:"#EF9F27",al:"rgba(239,159,39,.1)",ab:"rgba(239,159,39,.22)",tx:"#e0d4b4",mt:"rgba(224,212,180,.45)",gn:"#5DCAA5",cr:"#D85A30"},
  light:{bg:"#f0e8d0",sf:"#fdf7e8",cb:"#e2dcc8",am:"#7B4800",al:"rgba(123,72,0,.1)",ab:"rgba(123,72,0,.28)",tx:"#1a1004",mt:"rgba(26,16,4,.45)",gn:"#1A6B4A",cr:"#8B2000"},
  cyber:{bg:"#04040e",sf:"#080820",cb:"#020209",am:"#00ffe0",al:"rgba(0,255,224,.07)",ab:"rgba(0,255,224,.22)",tx:"#c0f4ff",mt:"rgba(192,244,255,.38)",gn:"#00ff88",cr:"#ff2d78"},
};

const XP_LEVELS=[
  {xp:0,lvl:1,ptTi:"Estagiário",enTi:"Intern"},
  {xp:60,lvl:2,ptTi:"Aprendiz",enTi:"Apprentice"},
  {xp:160,lvl:3,ptTi:"Calouro",enTi:"Newcomer"},
  {xp:320,lvl:4,ptTi:"Iniciante",enTi:"Beginner"},
  {xp:540,lvl:5,ptTi:"Dev Auxiliar",enTi:"Aux Dev"},
  {xp:820,lvl:6,ptTi:"Programador",enTi:"Programmer"},
  {xp:1160,lvl:7,ptTi:"Dev Júnior",enTi:"Junior Dev"},
  {xp:1560,lvl:8,ptTi:"Desenvolvedor",enTi:"Developer"},
  {xp:2020,lvl:9,ptTi:"Dev Pleno",enTi:"Mid Dev"},
  {xp:2540,lvl:10,ptTi:"Eng. Júnior",enTi:"Junior Eng."},
  {xp:3120,lvl:11,ptTi:"Eng. Pleno",enTi:"Mid Eng."},
  {xp:3760,lvl:12,ptTi:"Eng. Sênior",enTi:"Senior Eng."},
  {xp:4460,lvl:13,ptTi:"Tech Lead",enTi:"Tech Lead"},
  {xp:5220,lvl:14,ptTi:"Arquiteto",enTi:"Architect"},
  {xp:6040,lvl:15,ptTi:"Dev Sênior",enTi:"Senior Dev"},
  {xp:6920,lvl:16,ptTi:"Especialista",enTi:"Specialist"},
  {xp:7860,lvl:17,ptTi:"Mestre",enTi:"Master"},
  {xp:8860,lvl:18,ptTi:"Grão-Mestre",enTi:"Grand Master"},
  {xp:9920,lvl:19,ptTi:"Lendário",enTi:"Legendary"},
  {xp:11040,lvl:20,ptTi:"Arquimago do Código",enTi:"Code Archmage"},
];

function getLevel(xp){
  let cur=XP_LEVELS[0];
  for(const l of XP_LEVELS){if(xp>=l.xp)cur=l;else break;}
  const idx=XP_LEVELS.indexOf(cur);
  const next=XP_LEVELS[idx+1];
  const pct=next?Math.round(((xp-cur.xp)/(next.xp-cur.xp))*100):100;
  return{...cur,next,pct,xp};
}

const BOSSES=[
  {id:"boss1",afterIdx:4,icon:"ti-shield-bolt",ptTitle:"Mini-boss: A Guarda da Torre",enTitle:"Mini-boss: The Tower Guard",
   ptIntro:"Você chegou ao topo dos primeiros 5 capítulos! A Guarda da Torre bloqueia a passagem — responda 3 perguntas para avançar.",
   enIntro:"You've reached the top of the first 5 chapters! The Tower Guard blocks the way — answer 3 questions to advance.",
   xpBonus:40,
   questions:[
    {q:"O que uma variável armazena?",qEn:"What does a variable store?",opts:["Um único valor nomeado","Uma lista de funções","Um arquivo no disco"],optsEn:["A single named value","A list of functions","A file on disk"],ok:0},
    {q:"Qual estrutura testa uma condição?",qEn:"Which structure tests a condition?",opts:["for loop","if/else","função"],optsEn:["for loop","if/else","function"],ok:1},
    {q:"range(3) gera quais valores?",qEn:"range(3) generates which values?",opts:["1,2,3","0,1,2","0,1,2,3"],optsEn:["1,2,3","0,1,2","0,1,2,3"],ok:1},
   ]},
  {id:"boss2",afterIdx:9,icon:"ti-dragon",ptTitle:"Mini-boss: O Dragão do Castelo",enTitle:"Mini-boss: The Castle Dragon",
   ptIntro:"O Dragão do Castelo acorda! Para passar, prove seu domínio sobre os capítulos 6-10.",
   enIntro:"The Castle Dragon awakens! To pass, prove your mastery of chapters 6-10.",
   xpBonus:55,
   questions:[
    {q:"Como acessar 'nome' de um objeto?",qEn:"How to access 'name' from an object?",opts:["objeto[0]","objeto.nome","objeto->nome"],optsEn:["obj[0]","obj.name","obj->name"],ok:1},
    {q:"O que é 'NameError'?",qEn:"What is 'NameError'?",opts:["Erro de memória","Variável usada sem definir","Divisão por zero"],optsEn:["Memory error","Variable used before defined","Division by zero"],ok:1},
    {q:"O que '.upper()' faz em strings?",qEn:"What does '.upper()' do to strings?",opts:["Reverte","Maiúsculas","Remove espaços"],optsEn:["Reverses","Uppercase","Removes spaces"],ok:1},
   ]},
  {id:"boss3",afterIdx:14,icon:"ti-flame",ptTitle:"Mini-boss: O Oráculo Corrompido",enTitle:"Mini-boss: The Corrupted Oracle",
   ptIntro:"O Oráculo Corrompido desafia seu conhecimento avançado! Derrote-o para acessar os capítulos finais.",
   enIntro:"The Corrupted Oracle challenges your advanced knowledge! Defeat it to access the final chapters.",
   xpBonus:70,
   questions:[
    {q:"O que é o 'caso base' na recursão?",qEn:"What is the 'base case' in recursion?",opts:["O maior valor","Condição que para a chamada","O retorno padrão"],optsEn:["The largest value","Condition that stops the call","The default return"],ok:1},
    {q:"'finally' em try/except executa:",qEn:"'finally' in try/except runs:",opts:["Só se der erro","Sempre","Só se não der erro"],optsEn:["Only if error","Always","Only if no error"],ok:1},
    {q:"'await' serve para:",qEn:"'await' is used for:",opts:["Cancelar","Esperar async sem bloquear","Repetir"],optsEn:["Cancel","Wait async without blocking","Repeat"],ok:1},
   ]},
];

const BUGS=[
  {id:"taverna",ptTitle:"Bug das Variáveis",enTitle:"Variables Bug",
   broken:`nome = Byte\nnivel = 1\nprint(nome)\nprint(nivel)`,
   fixed:`nome = "Byte"\nnivel = 1\nprint(nome)\nprint(nivel)`,
   expected:"Byte\n1",
   ptHint:"Strings precisam de aspas duplas ou simples.",
   enHint:"Strings need double or single quotes."},
  {id:"encruzilhada",ptTitle:"Bug das Condicionais",enTitle:"Conditionals Bug",
   broken:`vida = 80\nif vida = 100:\n    print("cheio")\nelse:\n    print("ferido")`,
   fixed:`vida = 80\nif vida == 100:\n    print("cheio")\nelse:\n    print("ferido")`,
   expected:"ferido",
   ptHint:"Comparação usa == (duplo), não = (atribuição).",
   enHint:"Comparison uses == (double), not = (assignment)."},
  {id:"torre",ptTitle:"Bug dos Loops",enTitle:"Loops Bug",
   broken:`total = 0\nfor i in range(5)\n    total += i\nprint(total)`,
   fixed:`total = 0\nfor i in range(5):\n    total += i\nprint(total)`,
   expected:"10",
   ptHint:"O 'for' precisa de dois-pontos ':' no final.",
   enHint:"'for' needs a colon ':' at the end."},
  {id:"oficina",ptTitle:"Bug das Funções",enTitle:"Functions Bug",
   broken:`def dobrar(n):\n    resultado = n * 2\n\nprint(dobrar(5))`,
   fixed:`def dobrar(n):\n    resultado = n * 2\n    return resultado\n\nprint(dobrar(5))`,
   expected:"10",
   ptHint:"A função calcula mas esquece de retornar o valor.",
   enHint:"The function calculates but forgets to return the value."},
  {id:"mercado",ptTitle:"Bug dos Arrays",enTitle:"Arrays Bug",
   broken:`frutas = ["maçã","banana","laranja"]\nprint(frutas[3])`,
   fixed:`frutas = ["maçã","banana","laranja"]\nprint(frutas[2])`,
   expected:"laranja",
   ptHint:"Índices começam em 0. O último elemento de 3 itens é índice 2.",
   enHint:"Indices start at 0. The last element of 3 items is index 2."},
  {id:"castelo",ptTitle:"Bug dos Objetos",enTitle:"Objects Bug",
   broken:`heroi = {"nome": "Byte", "nivel": 5}\nprint(heroi["name"])`,
   fixed:`heroi = {"nome": "Byte", "nivel": 5}\nprint(heroi["nome"])`,
   expected:"Byte",
   ptHint:"A chave no dicionário está em português: 'nome', não 'name'.",
   enHint:"The dictionary key is in Portuguese: 'nome', not 'name'."},
  {id:"oraculo",ptTitle:"Bug do Debug",enTitle:"Debugging Bug",
   broken:`mensagem = "Olá mundo"\nprint(mensagem.uper())`,
   fixed:`mensagem = "Olá mundo"\nprint(mensagem.upper())`,
   expected:"OLÁ MUNDO",
   ptHint:"O método está com erro de digitação: 'uper' em vez de 'upper'.",
   enHint:"The method has a typo: 'uper' instead of 'upper'."},
  {id:"biblioteca",ptTitle:"Bug das Strings",enTitle:"Strings Bug",
   broken:`numero = 42\ntexto = "O número é: " + numero\nprint(texto)`,
   fixed:`numero = 42\ntexto = "O número é: " + str(numero)\nprint(texto)`,
   expected:"O número é: 42",
   ptHint:"Não dá para concatenar string com inteiro — converta com str().",
   enHint:"Can't concatenate string with integer — convert with str()."},
  {id:"portal",ptTitle:"Bug dos Booleans",enTitle:"Booleans Bug",
   broken:`ativo = true\nif ativo:\n    print("ligado")`,
   fixed:`ativo = True\nif ativo:\n    print("ligado")`,
   expected:"ligado",
   ptHint:"Em Python, booleanos são True/False com letra maiúscula.",
   enHint:"In Python, booleans are True/False with uppercase first letter."},
  {id:"museu",ptTitle:"Bug dos Tipos",enTitle:"Types Bug",
   broken:`a = "10"\nb = 5\nprint(a + b)`,
   fixed:`a = "10"\nb = 5\nprint(int(a) + b)`,
   expected:"15",
   ptHint:"'10' é string. Para somar com inteiro, converta com int().",
   enHint:"'10' is a string. To add with integer, convert with int()."},
  {id:"espelho",ptTitle:"Bug da Recursão",enTitle:"Recursion Bug",
   broken:`def contagem(n):\n    print(n)\n    contagem(n-1)\n\ncontagem(3)`,
   fixed:`def contagem(n):\n    if n <= 0:\n        return\n    print(n)\n    contagem(n-1)\n\ncontagem(3)`,
   expected:"3\n2\n1",
   ptHint:"Falta o caso base — sem ele, a recursão nunca para!",
   enHint:"Missing base case — without it, recursion never stops!"},
  {id:"camara",ptTitle:"Bug do Try/Except",enTitle:"Try/Except Bug",
   broken:`try:\n    x = int("abc")\nexcept ZeroDivisionError:\n    print("erro tratado")`,
   fixed:`try:\n    x = int("abc")\nexcept ValueError:\n    print("erro tratado")`,
   expected:"erro tratado",
   ptHint:"int('abc') lança ValueError, não ZeroDivisionError.",
   enHint:"int('abc') raises ValueError, not ZeroDivisionError."},
  {id:"academia",ptTitle:"Bug das Classes",enTitle:"Classes Bug",
   broken:`class Heroi:\n    def __init__(nome, nivel):\n        self.nome = nome\n        self.nivel = nivel\n\nh = Heroi("Byte",1)\nprint(h.nome)`,
   fixed:`class Heroi:\n    def __init__(self, nome, nivel):\n        self.nome = nome\n        self.nivel = nivel\n\nh = Heroi("Byte",1)\nprint(h.nome)`,
   expected:"Byte",
   ptHint:"__init__ precisa de 'self' como primeiro parâmetro.",
   enHint:"__init__ needs 'self' as its first parameter."},
  {id:"mensageiro",ptTitle:"Bug do Async",enTitle:"Async Bug",
   broken:`import asyncio\nasync def buscar():\n    asyncio.sleep(0)\n    return "pronto"\nasync def main():\n    r = buscar()\n    print(r)\nasyncio.run(main())`,
   fixed:`import asyncio\nasync def buscar():\n    await asyncio.sleep(0)\n    return "pronto"\nasync def main():\n    r = await buscar()\n    print(r)\nasyncio.run(main())`,
   expected:"pronto",
   ptHint:"Funções async precisam de 'await' antes de serem chamadas.",
   enHint:"Async functions need 'await' before being called."},
  {id:"feiticeiro",ptTitle:"Bug do Regex",enTitle:"Regex Bug",
   broken:`import re\ntexto = "Email: byte@code.com"\npadrao = r'[\\w]+@[\\w]+'\nemails = re.findall(padrao, texto)\nprint(emails[0])`,
   fixed:`import re\ntexto = "Email: byte@code.com"\npadrao = r'[\\w.]+@[\\w.]+'\nemails = re.findall(padrao, texto)\nprint(emails[0])`,
   expected:"byte@code.com",
   ptHint:"O padrão precisa de '.' para capturar o domínio completo.",
   enHint:"The pattern needs '.' to capture the full domain."},
  {id:"biblioteca2",ptTitle:"Bug da Ordenação",enTitle:"Sorting Bug",
   broken:`nums = [3,1,4,1,5,9,2,6]\nfor i in range(len(nums)):\n    for j in range(len(nums)-i):\n        if nums[j] > nums[j+1]:\n            nums[j],nums[j+1] = nums[j+1],nums[j]\nprint(nums)`,
   fixed:`nums = [3,1,4,1,5,9,2,6]\nfor i in range(len(nums)):\n    for j in range(len(nums)-i-1):\n        if nums[j] > nums[j+1]:\n            nums[j],nums[j+1] = nums[j+1],nums[j]\nprint(nums)`,
   expected:"[1, 1, 2, 3, 4, 5, 6, 9]",
   ptHint:"O índice interno vai além dos limites — precisa de -1 extra.",
   enHint:"The inner index goes out of bounds — needs an extra -1."},
  {id:"oraculo2",ptTitle:"Bug do Big O",enTitle:"Big O Bug",
   broken:`# Busca em lista ORDENADA\ndef buscar(lista, alvo):\n    for item in lista:\n        if item == alvo:\n            return True\n    return False\n\nprint(buscar([1,2,3,4,5,6,7,8], 7))`,
   fixed:`# Busca binária O(log n)\ndef buscar(lista, alvo):\n    esq, dir = 0, len(lista)-1\n    while esq <= dir:\n        m = (esq+dir)//2\n        if lista[m] == alvo: return True\n        elif lista[m] < alvo: esq = m+1\n        else: dir = m-1\n    return False\n\nprint(buscar([1,2,3,4,5,6,7,8], 7))`,
   expected:"True",
   ptHint:"Lista ordenada → busca binária O(log n) em vez de linear O(n).",
   enHint:"Sorted list → binary search O(log n) instead of linear O(n)."},
];

const ANIM_STEPS={
  taverna:[
    {code:"nome = \"Byte\"",vars:{},desc:{pt:"Antes de executar...",en:"Before executing..."}},
    {code:"nome = \"Byte\"",vars:{nome:'"Byte"'},desc:{pt:"nome recebe o valor 'Byte'",en:"nome receives the value 'Byte'"}},
    {code:"nivel = 1",vars:{nome:'"Byte"',nivel:1},desc:{pt:"nivel recebe o valor 1",en:"nivel receives the value 1"}},
    {code:"vida = 100",vars:{nome:'"Byte"',nivel:1,vida:100},desc:{pt:"vida recebe o valor 100",en:"vida receives the value 100"}},
    {code:"print(nome)",vars:{nome:'"Byte"',nivel:1,vida:100},desc:{pt:"Saída: Byte",en:"Output: Byte"},out:"Byte"},
  ],
  torre:[
    {code:"for i in range(5):",vars:{i:"—",total:0},desc:{pt:"total começa em 0, i ainda não existe",en:"total starts at 0, i doesn't exist yet"}},
    {code:"    total += i  # i=0",vars:{i:0,total:0},desc:{pt:"i=0, total=0+0=0",en:"i=0, total=0+0=0"}},
    {code:"    total += i  # i=1",vars:{i:1,total:1},desc:{pt:"i=1, total=0+1=1",en:"i=1, total=0+1=1"}},
    {code:"    total += i  # i=2",vars:{i:2,total:3},desc:{pt:"i=2, total=1+2=3",en:"i=2, total=1+2=3"}},
    {code:"    total += i  # i=3",vars:{i:3,total:6},desc:{pt:"i=3, total=3+3=6",en:"i=3, total=3+3=6"}},
    {code:"    total += i  # i=4",vars:{i:4,total:10},desc:{pt:"i=4, total=6+4=10",en:"i=4, total=6+4=10"}},
    {code:"print(total)",vars:{i:4,total:10},desc:{pt:"Loop terminou! Saída: 10",en:"Loop done! Output: 10"},out:"10"},
  ],
  oficina:[
    {code:"def dobrar(n):",vars:{},desc:{pt:"Definindo a função — nada executa ainda",en:"Defining the function — nothing runs yet"}},
    {code:"dobrar(5)",vars:{},desc:{pt:"Chamando dobrar com n=5",en:"Calling dobrar with n=5"}},
    {code:"    res = n * 2",vars:{n:5,res:10},desc:{pt:"Dentro da função: res = 5 × 2 = 10",en:"Inside the function: res = 5 × 2 = 10"}},
    {code:"    return res",vars:{n:5,res:10},desc:{pt:"Retorna 10 para quem chamou",en:"Returns 10 to the caller"},out:"10"},
    {code:"dobrar(8)",vars:{},desc:{pt:"Chamando novamente com n=8",en:"Calling again with n=8"}},
    {code:"    return 8*2",vars:{n:8,res:16},desc:{pt:"Mesma função, novo valor: 16",en:"Same function, new value: 16"},out:"16"},
  ],
  mercado:[
    {code:"frutas = [...]",vars:{frutas:"[ ]"},desc:{pt:"Array começa vazio",en:"Array starts empty"}},
    {code:"frutas = [\"maçã\",\"banana\",\"uva\"]",vars:{frutas:["maçã","banana","uva"]},desc:{pt:"3 elementos nos índices 0,1,2",en:"3 elements at indices 0,1,2"}},
    {code:"frutas[0]",vars:{frutas:["maçã","banana","uva"],acesso:"frutas[0]"},desc:{pt:"Índice 0 → 'maçã'",en:"Index 0 → 'maçã'"},out:"maçã"},
    {code:"frutas.append(\"kiwi\")",vars:{frutas:["maçã","banana","uva","kiwi"]},desc:{pt:"append adiciona ao final, agora 4 itens",en:"append adds to end, now 4 items"}},
    {code:"len(frutas)",vars:{frutas:["maçã","banana","uva","kiwi"]},desc:{pt:"len() conta: 4 elementos",en:"len() counts: 4 elements"},out:"4"},
  ],
};

const ACH_IDS=["first_good","no_hints","streak3","speed","polyglot","sandbox_a","collector","flawless","daily","multi","boss_slayer","bug_fixer","streak7","lvl10","all_chapters"];
const ACH_ICONS=["ti-star","ti-eye-off","ti-brain","ti-bolt","ti-code","ti-terminal-2","ti-backpack","ti-trophy","ti-calendar","ti-users","ti-shield-bolt","ti-bug","ti-flame","ti-trending-up","ti-crown"];

function mkAudio(){try{const c=new(window.AudioContext||window.webkitAudioContext)();const t=(f,d,y="sine",v=.15)=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type=y;o.frequency.value=f;g.gain.setValueAtTime(v,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.start();o.stop(c.currentTime+d);};return{ok:()=>{t(523,.1);setTimeout(()=>t(784,.2),140);},err:()=>t(180,.3,"sawtooth",.1),click:()=>t(440,.04),win:()=>[523,659,784,1047].forEach((f,i)=>setTimeout(()=>t(f,.25),i*120)),tick:()=>t(880,.03,"square",.04),boss:()=>[349,440,523,659,784].forEach((f,i)=>setTimeout(()=>t(f,.18,i%2?"square":"sine"),i*90))};}catch{return{ok:()=>{},err:()=>{},click:()=>{},win:()=>{},tick:()=>{},boss:()=>{}};}}

function S(sc,f,lg){const ef=f+"En";return(lg==="en"&&sc[ef])?sc[ef]:sc[f];}
function SC(c,f,lg){const ef=f+"En";return(lg==="en"&&c[ef])?c[ef]:c[f];}
const SCENES=[
  {id:"taverna",ch:"Cap. 1",chEn:"Ch. 1",icon:"ti-home",portrait:{ic:"ti-wand",cl:"#9F77DD",nm:"Varinha, a elfa",nmEn:"Varinha, the Elf"},mapPos:{x:12,y:55},
   item:{icon:"ti-book",name:"Grande Registro",nameEn:"Great Registry"},
   narr:`Você é Byte, aprendiz no Reino do Código. Sua missão: restaurar os sistemas do Grande Oráculo.\n\nA taverneira Varinha abre um enorme livro:\n\n— Para registrar sua presença, como prefere que eu anote seu nome?`,
   narrH:`Varinha precisa registrar seu nome. Como você faz isso?`,
   narrEn:`You are Byte, an apprentice in the Code Kingdom. Your mission: restore the systems of the Great Oracle.\n\nThe innkeeper Varinha opens a huge book:\n\n— To register your presence, how would you like me to record your name?`,
   narrHEn:`Varinha needs to record your name. How do you do it?`,
   hint:"Variáveis são como caixas com etiqueta — guardam um valor pelo nome.",
   hintEn:"Variables are like labeled boxes — they store a value by name.",
   concept:{nm:"Variáveis",nmEn:"Variables",cl:"#378ADD",bg:"rgba(55,138,221,.07)",bd:"rgba(55,138,221,.22)",
    sum:"Uma variável é uma caixa nomeada que guarda um valor. Crie quantas precisar e acesse o valor pelo nome.",
    sumEn:"A variable is a named box that stores a value. Create as many as you need and access the value by name.",
    py:`nome = "Byte"\nnivel = 1\nvida = 100\n\nprint(nome)    # → "Byte"\nprint(nivel)   # → 1\n\n# Reatribuir:\nnivel = 2\nprint(nivel)   # → 2`,
    js:`let nome = "Byte";\nlet nivel = 1;\nlet vida = 100;\n\nconsole.log(nome);   // → "Byte"\nconsole.log(nivel);  // → 1\n\n// Reassign:\nnivel = 2;\nconsole.log(nivel);  // → 2`},
   choices:[
    {text:'Registrar formalmente: nome = "Byte"',textEn:'Register formally: name = "Byte"',good:true,
     cons:`Varinha escreve: nome = "Byte". A etiqueta 'nome' aponta para 'Byte'.\n\n— Você criou uma VARIÁVEL! Acesse a qualquer momento apenas pelo nome.`,
     consEn:`Varinha writes: name = "Byte". The label 'name' points to 'Byte'.\n\n— You created a VARIABLE! Access it anytime just by name.`},
    {text:"Anotar num guardanapo qualquer",textEn:"Scribble it on a random napkin",good:false,
     cons:`O guardanapo voa pela janela com o vento.\n\n— Sem variável, a informação desapareceu para sempre!`,
     consEn:`The napkin flies out the window with the wind.\n\n— Without a variable, the information is gone forever!`,
     branch:`Varinha refaz o registro: nome = "Byte".\n\n— Veja: a etiqueta 'nome' aponta para 'Byte'. Assim funciona uma variável.`,
     branchEn:`Varinha re-registers: name = "Byte".\n\n— See: the label 'name' points to 'Byte'. That's how a variable works.`}],
   quiz:{q:"Qual a melhor definição de variável?",qEn:"What is the best definition of a variable?",
    opts:["Caixa nomeada que guarda um valor","Lista de instruções a seguir","Tipo especial de número"],
    optsEn:["A named box that stores a value","A list of instructions to follow","A special type of number"],ok:0}},

  {id:"encruzilhada",ch:"Cap. 2",chEn:"Ch. 2",icon:"ti-git-branch",portrait:{ic:"ti-shield",cl:"#5DCAA5",nm:"Guardião da Passagem",nmEn:"Guardian of the Pass"},mapPos:{x:28,y:42},
   item:{icon:"ti-diamond",name:"Cristal de Acesso",nameEn:"Access Crystal"},
   narr:`Uma encruzilhada surge à frente. Um guarda imponente barra o caminho:\n\n— Alto! Só passa quem tem o Cristal de Acesso.\n\nVarinha te entregou algo brilhante ao sair. Como agir?`,
   narrH:`Guarda exige o Cristal de Acesso. Você tem ou não? Como agir?`,
   narrEn:`A crossroads appears ahead. An imposing guard blocks the path:\n\n— Halt! Only those with the Access Crystal may pass.\n\nVarinha handed you something shiny on the way out. What do you do?`,
   narrHEn:`The guard demands the Access Crystal. Do you have it or not? What do you do?`,
   hint:"Sempre verifique a condição antes de agir — isso é um if/else.",
   hintEn:"Always check the condition before acting — that's an if/else.",
   concept:{nm:"Condicionais",nmEn:"Conditionals",cl:"#1D9E75",bg:"rgba(29,158,117,.07)",bd:"rgba(29,158,117,.22)",
    sum:"Condicionais permitem tomar decisões: SE uma condição for verdadeira, execute A; SENÃO, execute B.",
    sumEn:"Conditionals allow decision-making: IF a condition is true, execute A; ELSE, execute B.",
    py:`if tem_cristal:\n    passar_guarda()\nelse:\n    procurar_saida()\n\n# Encadeado:\nif vida > 50: atacar()\nelif vida > 20: defender()\nelse: fugir()`,
    js:`if (hasCrystal) {\n    passGuard();\n} else {\n    findExit();\n}\n\n// Chained:\nif (life>50) attack();\nelse if (life>20) defend();\nelse flee();`},
   choices:[
    {text:"Verificar o inventário antes de responder",textEn:"Check your inventory before responding",good:true,
     cons:`SE tenho cristal... SIM! Está no bolso!\n\n— Você avaliou a condição antes de agir. Isso é um CONDICIONAL perfeito.`,
     consEn:`IF I have the crystal... YES! It's in my pocket!\n\n— You evaluated the condition before acting. That's a perfect CONDITIONAL.`},
    {text:"Assumir que não tem e pedir ajuda",textEn:"Assume you don't have it and ask for help",good:false,
     cons:`O guarda aponta pro bolso — o cristal brilhava lá.\n\n— Assumiu sem verificar! Em código, nunca assuma.`,
     consEn:`The guard points to your pocket — the crystal was glowing there.\n\n— You assumed without checking! In code, never assume.`,
     branch:`— if (tem_cristal) { passar() } teria verificado primeiro. Teste, nunca assuma.`,
     branchEn:`— if (hasCrystal) { pass() } would have checked first. Test, never assume.`}],
   quiz:{q:"O que acontece quando o 'if' é falso e há 'else'?",qEn:"What happens when the 'if' is false and there's an 'else'?",
    opts:["Programa encerra","Bloco 'else' executa","Condição testada novamente"],
    optsEn:["Program ends","The 'else' block executes","Condition is tested again"],ok:1}},

  {id:"torre",ch:"Cap. 3",chEn:"Ch. 3",icon:"ti-refresh",portrait:{ic:"ti-mood-smile",cl:"#EF9F27",nm:"Duende da Torre",nmEn:"Tower Goblin"},mapPos:{x:42,y:30},
   item:{icon:"ti-circles",name:"Pedras Mágicas",nameEn:"Magic Stones"},
   narr:`Torre de 100 degraus de pedra cinza. Um duende sorridente:\n\n— Uma pedra mágica em cada degrau. Todas as 100.\n\nEle entrega uma sacola e pisca enigmaticamente.`,
   narrH:`100 degraus, uma pedra cada. Como resolver eficientemente?`,
   narrEn:`A tower of 100 grey stone steps. A smiling goblin:\n\n— One magic stone on every step. All 100 of them.\n\nHe hands you a bag and winks enigmatically.`,
   narrHEn:`100 steps, one stone each. How do you solve it efficiently?`,
   hint:"Para repetir a mesma ação muitas vezes, use for ou while.",
   hintEn:"To repeat the same action many times, use for or while.",
   concept:{nm:"Loops",nmEn:"Loops",cl:"#D85A30",bg:"rgba(216,90,48,.07)",bd:"rgba(216,90,48,.22)",
    sum:"Loops repetem um bloco automaticamente. Em vez de 100 linhas idênticas, você escreve uma vez.",
    sumEn:"Loops repeat a block automatically. Instead of 100 identical lines, you write it once.",
    py:`for degrau in range(1, 101):\n    colocar_pedra(degrau)\n\n# While:\ncontador = 0\nwhile contador < 100:\n    colocar_pedra(contador)\n    contador += 1`,
    js:`for (let d=1; d<=100; d++) {\n    placeStone(d);\n}\n\n// While:\nlet c = 0;\nwhile (c < 100) {\n    placeStone(c++);\n}`},
   choices:[
    {text:"Feitiço que se repete 100x automaticamente",textEn:"A spell that repeats automatically 100 times",good:true,
     cons:`Pedras voam e se posicionam em segundos!\n\n— Um LOOP! Descreveu o padrão uma vez, executou 100 vezes.`,
     consEn:`Stones fly and position themselves in seconds!\n\n— A LOOP! You described the pattern once, executed it 100 times.`},
    {text:"Subir e colocar cada pedra manualmente",textEn:"Climb and place each stone manually",good:false,
     cons:`No degrau 67 seus joelhos protestam.\n\n— Loops existem para isso. Imagine 10.000 degraus!`,
     consEn:`On step 67 your knees protest.\n\n— Loops exist for this. Imagine 10,000 steps!`,
     branch:`— for degrau in range(100): colocar(degrau). Uma linha = 100 ações.`,
     branchEn:`— for step in range(100): place(step). One line = 100 actions.`}],
   quiz:{q:"'for i in range(5)' executa quantas vezes?",qEn:"How many times does 'for i in range(5)' execute?",
    opts:["4","5","6"],optsEn:["4","5","6"],ok:1}},

  {id:"oficina",ch:"Cap. 4",chEn:"Ch. 4",icon:"ti-tool",portrait:{ic:"ti-hammer",cl:"#BA7517",nm:"Mestre Artesã",nmEn:"Master Craftsperson"},mapPos:{x:55,y:24},
   item:{icon:"ti-flame",name:"Fogo Perpétuo",nameEn:"Eternal Fire"},
   narr:`No alto da torre: uma oficina. A mestre artesã:\n\n— 50 tochas para acender. Cada uma: pegar fósforo, riscar, aproximar, soprar.\n\nComo organizar para não errar nenhuma etapa?`,
   narrH:`50 tochas, 4 passos cada. Como não errar nenhuma etapa?`,
   narrEn:`At the top of the tower: a workshop. The master craftsperson:\n\n— 50 torches to light. Each one: grab a match, strike, bring to flame, blow.\n\nHow do you organize to not miss a single step?`,
   narrHEn:`50 torches, 4 steps each. How do you not miss a single step?`,
   hint:"Encapsule os passos em um bloco com nome que pode ser chamado quantas vezes quiser.",
   hintEn:"Encapsulate the steps in a named block that can be called as many times as needed.",
   concept:{nm:"Funções",nmEn:"Functions",cl:"#7F77DD",bg:"rgba(127,119,221,.07)",bd:"rgba(127,119,221,.22)",
    sum:"Uma função é um bloco de código com nome. Escreva uma vez, execute quantas vezes quiser — sem repetição.",
    sumEn:"A function is a named block of code. Write it once, run it as many times as you want — no repetition.",
    py:`def acender_tocha():\n    pegar_fosforo()\n    riscar()\n    aproximar_chama()\n    soprar_suave()\n\nfor i in range(50):\n    acender_tocha()  # perfeita toda vez!\n\n# Com retorno:\ndef saudar(nome):\n    return "Olá, " + nome`,
    js:`function lightTorch() {\n    grabMatch();\n    strike();\n    bringToFlame();\n    blowGently();\n}\n\nfor(let i=0;i<50;i++) lightTorch();\n\n// With return:\nfunction greet(name) {\n    return "Hello, " + name;\n}`},
   choices:[
    {text:"Criar feitiço reutilizável: acender_tocha()",textEn:"Create a reusable spell: light_torch()",good:true,
     cons:`50 tochas acesas com precisão perfeita!\n\n— FUNÇÃO! Uma vez escrita, chame quantas vezes quiser. Perfeita toda vez.`,
     consEn:`50 torches lit with perfect precision!\n\n— FUNCTION! Write it once, call it as many times as you want. Perfect every time.`},
    {text:"Memorizar os passos e repetir mentalmente",textEn:"Memorize the steps and repeat mentally",good:false,
     cons:`Na tocha 23 você erra a ordem. Na 31, esquece o fósforo.\n\n— Funções garantem a sequência correta toda vez!`,
     consEn:`On torch 23 you mix up the order. On 31, you forget the match.\n\n— Functions guarantee the correct sequence every time!`,
     branch:`— def acender_tocha(): [4 passos]. Chamada 50x = perfeição 50x.`,
     branchEn:`— def light_torch(): [4 steps]. Called 50x = perfection 50x.`}],
   quiz:{q:"Principal vantagem das funções?",qEn:"Main advantage of functions?",
    opts:["Executam mais rápido","Evitam repetição e facilitam manutenção","Só funcionam com números"],
    optsEn:["They run faster","Avoid repetition and ease maintenance","Only work with numbers"],ok:1}},

  {id:"mercado",ch:"Cap. 5",chEn:"Ch. 5",icon:"ti-list",portrait:{ic:"ti-building-store",cl:"#BA7517",nm:"Mercador Festivo",nmEn:"Festive Merchant"},mapPos:{x:65,y:38},
   item:{icon:"ti-backpack",name:"Bolsa Mágica",nameEn:"Magic Bag"},
   narr:`O Mercado das Maravilhas. O mercador empilha 10 itens na bancada:\n\nEspada. Escudo. Poção. Mapa. Bússola. Lanterna. Corda. Pederneira. Cantil. Pergaminho.\n\n— Como vai organizar tudo isso?`,
   narrH:`10 itens para guardar. Como organizar na memória?`,
   narrEn:`The Market of Wonders. The merchant stacks 10 items on the counter:\n\nSword. Shield. Potion. Map. Compass. Lantern. Rope. Flint. Canteen. Scroll.\n\n— How will you organize all of this?`,
   narrHEn:`10 items to store. How do you organize them in memory?`,
   hint:"Quando há muitos valores relacionados, agrupe em um array (lista).",
   hintEn:"When you have many related values, group them in an array (list).",
   concept:{nm:"Arrays",nmEn:"Arrays",cl:"#BA7517",bg:"rgba(186,117,23,.07)",bd:"rgba(186,117,23,.22)",
    sum:"Um array é uma coleção ordenada de valores sob um nome. Acesse pelo índice, começando em 0.",
    sumEn:"An array is an ordered collection of values under one name. Access by index, starting at 0.",
    py:`itens = ["espada","escudo","poção","mapa","bússola"]\n\nitens[0]        # → "espada"\nitens[-1]       # → "bússola"\nlen(itens)      # → 5\nitens.append("corda")\nitens.remove("mapa")`,
    js:`const items = ["sword","shield","potion","map","compass"];\n\nitems[0];           // → "sword"\nitems.at(-1);       // → "compass"\nitems.length;       // → 5\nitems.push("rope");\nitems.splice(3,1);`},
   choices:[
    {text:'Lista: suprimentos = ["espada","escudo"...]',textEn:'List: supplies = ["sword","shield"...]',good:true,
     cons:`Tudo organizado! suprimentos[0] → "espada". len() → 10.\n\n— ARRAY! Valores agrupados, acessados por índice. Escalável.`,
     consEn:`Everything organized! supplies[0] → "sword". len() → 10.\n\n— ARRAY! Values grouped, accessed by index. Scalable.`},
    {text:"Variável separada para cada item",textEn:"A separate variable for each item",good:false,
     cons:`Com 10 itens: confuso. Com 10.000: impossível.\n\n— Arrays agrupam dados com posições indexadas.`,
     consEn:`With 10 items: confusing. With 10,000: impossible.\n\n— Arrays group data with indexed positions.`,
     branch:`— suprimentos[0] é sempre "espada". Previsível. Arrays escalam infinitamente.`,
     branchEn:`— supplies[0] is always "sword". Predictable. Arrays scale infinitely.`}],
   quiz:{q:"Qual o índice do PRIMEIRO elemento de um array?",qEn:"What is the index of the FIRST element of an array?",
    opts:["1","0","-1"],optsEn:["1","0","-1"],ok:1}},

  {id:"castelo",ch:"Cap. 6",chEn:"Ch. 6",icon:"ti-crown",portrait:{ic:"ti-spy",cl:"#5DCAA5",nm:"Porteiro Gnomo",nmEn:"Gnome Doorman"},mapPos:{x:72,y:52},
   item:{icon:"ti-shield",name:"Brasão do Castelo",nameEn:"Castle Crest"},
   narr:`O Castelo do Código. O porteiro gnomo exige perfil completo:\n\n— Nome, nível, classe e pontos de vida. Quatro informações sobre a mesma entidade.\n\nComo vai organizar?`,
   narrH:`Porteiro quer nome, nível, classe e vida. Como agrupar tudo?`,
   narrEn:`The Code Castle. The gnome doorman demands a complete profile:\n\n— Name, level, class and health points. Four pieces of information about the same entity.\n\nHow will you organize it?`,
   narrHEn:`The doorman wants name, level, class, and health. How do you group it all?`,
   hint:"Dados de uma mesma entidade ficam melhor agrupados em um objeto.",
   hintEn:"Data from the same entity is better grouped in an object.",
   concept:{nm:"Objetos",nmEn:"Objects",cl:"#1D9E75",bg:"rgba(29,158,117,.07)",bd:"rgba(29,158,117,.22)",
    sum:"Um objeto agrupa dados relacionados de uma entidade. Acesse com objeto['chave'] ou objeto.chave.",
    sumEn:"An object groups related data of an entity. Access with object['key'] or object.key.",
    py:`heroi = {\n    "nome": "Byte",\n    "nivel": 6,\n    "classe": "Desenvolvedor",\n    "vida": 100\n}\n\nheroi["nome"]    # → "Byte"\nheroi["vida"] = 80\nheroi["xp"] = 500  # novo campo`,
    js:`const hero = {\n    name: "Byte",\n    level: 6,\n    class: "Developer",\n    health: 100\n};\n\nhero.name;       // → "Byte"\nhero.health = 80;\nhero.xp = 500;  // new field`},
   choices:[
    {text:"Criar objeto herói com todas as propriedades",textEn:"Create a hero object with all properties",good:true,
     cons:`heroi.nome, heroi.vida — organizado e coeso!\n\n— OBJETO! Entidade única, propriedades acessíveis. Modela o mundo real.`,
     consEn:`hero.name, hero.health — organized and cohesive!\n\n— OBJECT! Single entity, accessible properties. Models the real world.`},
    {text:"Variáveis separadas para cada dado",textEn:"Separate variables for each piece of data",good:false,
     cons:`'vida' conflita com a vida do porteiro. Caos.\n\n— Objetos criam um espaço próprio para cada entidade.`,
     consEn:`'health' conflicts with the doorman's health variable. Chaos.\n\n— Objects create their own space for each entity.`,
     branch:`— heroi.vida é inequívoco. 'vida' solta colide com outras vars.`,
     branchEn:`— hero.health is unambiguous. Loose 'health' collides with other vars.`}],
   quiz:{q:"Como acessar 'nome' do objeto 'heroi'?",qEn:"How do you access 'name' from the 'hero' object?",
    opts:["heroi[nome]","heroi.nome ou heroi['nome']","nome.heroi"],
    optsEn:["hero[name]","hero.name or hero['name']","name.hero"],ok:1}},

  {id:"oraculo",ch:"Cap. 7",chEn:"Ch. 7",icon:"ti-bug",portrait:{ic:"ti-eye",cl:"#E24B4A",nm:"Grande Oráculo",nmEn:"Great Oracle"},mapPos:{x:78,y:65},
   item:{icon:"ti-zoom-in",name:"Lupa do Debug",nameEn:"Debug Magnifier"},
   narr:`O Oráculo pulsa em vermelho. Telas de alarme:\n\n    NameError: 'cristal_de_aceso' não definido\n    linha 42\n\n— Os sistemas do reino estão falhando. Corrija o bug!`,
   narrH:`NameError: 'cristal_de_aceso' não definido — linha 42. O que você faz?`,
   narrEn:`The Oracle pulses red. Alarm screens:\n\n    NameError: 'acces_cristal' is not defined\n    line 42\n\n— The kingdom's systems are failing. Fix the bug!`,
   narrHEn:`NameError: 'acces_cristal' is not defined — line 42. What do you do?`,
   hint:"Leia a mensagem de erro — ela diz O QUÊ falhou e em qual linha.",
   hintEn:"Read the error message — it tells you WHAT failed and on which line.",
   concept:{nm:"Debugging",nmEn:"Debugging",cl:"#E24B4A",bg:"rgba(226,75,74,.07)",bd:"rgba(226,75,74,.22)",
    sum:"Debugging é encontrar e corrigir bugs. A mensagem de erro diz O QUÊ e ONDE. Leia com atenção.",
    sumEn:"Debugging is finding and fixing bugs. The error message says WHAT and WHERE. Read it carefully.",
    py:`# Erro original:\ncristal_de_aceso    # ← falta um 's'!\n\n# Correção:\ncristal_de_acesso\n\n# Tipos de erro comuns:\n# NameError   → variável não definida\n# TypeError   → tipo errado\n# SyntaxError → código malformado`,
    js:`// Original error:\naccesCristal;     // ← missing a 'c'!\n\n// Fix:\naccessCristal;\n\n// Common error types:\n// ReferenceError → not defined\n// TypeError      → wrong type\n// SyntaxError    → malformed code`},
   choices:[
    {text:"Ler o erro e corrigir cirurgicamente",textEn:"Read the error and fix it surgically",good:true,
     cons:`'cristal_de_aceso' vs 'cristal_de_acesso' — um 's'! Corrigido!\n\n— Você debugou! Um caractere pode derrubar um sistema inteiro.`,
     consEn:`'acces_cristal' vs 'access_cristal' — one 'c'! Fixed!\n\n— You debugged! One character can bring down an entire system.`},
    {text:"Reescrever tudo do zero com medo",textEn:"Rewrite everything from scratch out of fear",good:false,
     cons:`Você replica o mesmo erro. Sistema continua falhando.\n\n— Bugs não somem com pânico. Leia, localize, corrija.`,
     consEn:`You replicate the same error. System keeps failing.\n\n— Bugs don't disappear with panic. Read, locate, fix.`,
     branch:`— A mensagem dizia: linha 42, 'cristal_de_aceso'. Cirurgia, não demolição.`,
     branchEn:`— The message said: line 42, 'acces_cristal'. Surgery, not demolition.`}],
   quiz:{q:"O que 'NameError' indica?",qEn:"What does 'NameError' indicate?",
    opts:["Erro de sintaxe","Variável usada sem ser definida","Divisão por zero"],
    optsEn:["Syntax error","Variable used without being defined","Division by zero"],ok:1}},

  {id:"biblioteca",ch:"Cap. 8",chEn:"Ch. 8",icon:"ti-book",portrait:{ic:"ti-feather",cl:"#D4537E",nm:"Fada Escriba",nmEn:"Scribe Fairy"},mapPos:{x:68,y:75},
   item:{icon:"ti-scroll",name:"Pergaminho Antigo",nameEn:"Ancient Scroll"},
   narr:`A Biblioteca dos Textos. A fada escriba precisa criar índices únicos:\n\n    "A Lenda" + " #" + "42"\n\n— Como você manipularia texto assim?`,
   narrH:`Concatenar "A Lenda" + " #" + "42". Como fazer?`,
   narrEn:`The Library of Texts. The scribe fairy needs to create unique indexes:\n\n    "The Legend" + " #" + "42"\n\n— How would you manipulate text like this?`,
   narrHEn:`Concatenate "The Legend" + " #" + "42". How to do it?`,
   hint:"Strings podem ser unidas com o operador + — isso é concatenação.",
   hintEn:"Strings can be joined with the + operator — that's concatenation.",
   concept:{nm:"Strings",nmEn:"Strings",cl:"#D4537E",bg:"rgba(212,83,126,.07)",bd:"rgba(212,83,126,.22)",
    sum:"Strings são sequências de texto. Concatene, fatie, busque, transforme. Tipo de dado mais comum.",
    sumEn:"Strings are text sequences. Concatenate, slice, search, transform. The most common data type.",
    py:`titulo = "A Lenda"\nindice = titulo + " #42"   # "A Lenda #42"\n\ntitulo.upper()    # "A LENDA"\ntitulo.lower()    # "a lenda"\nlen(titulo)       # 7\ntitulo[0]         # "A"\ntitulo.split(" ") # ["A","Lenda"]`,
    js:`const title = "The Legend";\nconst index = title + " #42"; // "The Legend #42"\n\ntitle.toUpperCase(); // "THE LEGEND"\ntitle.toLowerCase(); // "the legend"\ntitle.length;        // 10\ntitle[0];            // "T"\ntitle.split(" ");    // ["The","Legend"]`},
   choices:[
    {text:'Concatenar: "A Lenda" + " #" + "42"',textEn:'Concatenate: "The Legend" + " #" + "42"',good:true,
     cons:`"A Lenda #42"! Strings unidas com +.\n\n— STRINGS têm dezenas de operações: fatiar, buscar, transformar.`,
     consEn:`"The Legend #42"! Strings joined with +.\n\n— STRINGS have dozens of operations: slice, search, transform.`},
    {text:'Somar como números: 42 + "A Lenda"',textEn:'Add like numbers: 42 + "The Legend"',good:false,
     cons:`TypeError! Número não soma com texto diretamente.\n\n— Converta primeiro: str(42) em Python, String(42) em JS.`,
     consEn:`TypeError! A number doesn't add directly to text.\n\n— Convert first: str(42) in Python, String(42) in JS.`,
     branch:`— "A Lenda #" + str(42) → "A Lenda #42". Tipo importa.`,
     branchEn:`— "The Legend #" + str(42) → "The Legend #42". Type matters.`}],
   quiz:{q:"O que 'texto'.upper() faz?",qEn:"What does 'text'.upper() do?",
    opts:["Converte para maiúsculas","Remove espaços","Inverte o texto"],
    optsEn:["Converts to uppercase","Removes spaces","Reverses the text"],ok:0}},

  {id:"portal",ch:"Cap. 9",chEn:"Ch. 9",icon:"ti-toggle-right",portrait:{ic:"ti-yin-yang",cl:"#534AB7",nm:"Guardiões da Verdade",nmEn:"Guardians of Truth"},mapPos:{x:58,y:85},
   item:{icon:"ti-eye",name:"Olho da Verdade",nameEn:"Eye of Truth"},
   narr:`Portal dos Guardiões Verdade e Falsidade:\n\n— Existem apenas dois estados: VERDADEIRO ou FALSO. Nada mais.\n\nComo você representa esse conceito em código?`,
   narrH:`Apenas dois estados: verdadeiro ou falso. Como representar?`,
   narrEn:`Portal of the Guardians Truth and Falsehood:\n\n— There are only two states: TRUE or FALSE. Nothing else.\n\nHow do you represent this concept in code?`,
   narrHEn:`Only two states: true or false. How do you represent them?`,
   hint:"Existe um tipo especial para valores que só podem ser true ou false — booleanos.",
   hintEn:"There is a special type for values that can only be true or false — booleans.",
   concept:{nm:"Booleans",nmEn:"Booleans",cl:"#534AB7",bg:"rgba(83,74,183,.07)",bd:"rgba(83,74,183,.22)",
    sum:"Booleanos: True ou False. São o resultado de comparações e a base de toda lógica condicional.",
    sumEn:"Booleans: True or False. They are the result of comparisons and the foundation of all conditional logic.",
    py:`ativo = True\nmorto = False\n\n5 > 3          # True\n"a" == "b"     # False\n10 != 5        # True\n\nTrue and False  # False\nTrue or False   # True\nnot True        # False`,
    js:`let active = true;\nlet dead = false;\n\n5 > 3;          // true\n"a" === "b";    // false\n10 !== 5;       // true\n\ntrue && false;  // false\ntrue || false;  // true\n!true;          // false`},
   choices:[
    {text:"ativo = True, derrotado = False",textEn:"active = True, defeated = False",good:true,
     cons:`Guardiões inclinam-se.\n\n— BOOLEANS! Tipo mais simples. Toda comparação retorna True/False. Base da lógica.`,
     consEn:`The guardians bow.\n\n— BOOLEANS! Simplest type. Every comparison returns True/False. Foundation of logic.`},
    {text:'estado = "sim" ou estado = "não"',textEn:'state = "yes" or state = "no"',good:false,
     cons:`"sim", "Sim", "SIM" — três valores diferentes! Ambiguidade fatal.\n\n— True/False são universais e sem variações.`,
     consEn:`"yes", "Yes", "YES" — three different values! Fatal ambiguity.\n\n— True/False are universal and never vary.`,
     branch:`— if estado=="sim": e alguém digita "Sim" — bug! True/False nunca variam.`,
     branchEn:`— if state=="yes": and someone types "Yes" — bug! True/False never vary.`}],
   quiz:{q:"O que '10 > 5' retorna?",qEn:"What does '10 > 5' return?",
    opts:["10","True","5"],optsEn:["10","True","5"],ok:1}},

  {id:"museu",ch:"Cap. 10",chEn:"Ch. 10",icon:"ti-flask",portrait:{ic:"ti-microscope",cl:"#BA7517",nm:"Curadora do Museu",nmEn:"Museum Curator"},mapPos:{x:45,y:80},
   item:{icon:"ti-flask",name:"Frasco de Tipos",nameEn:"Type Flask"},
   narr:`O Museu dos Valores cataloga toda informação do reino.\n\nUm aprendiz precisa guardar: nome, pontuação, se está ativo e lista de itens.\n\nQual tipo para cada dado?`,
   narrH:`Nome, pontuação, ativo(sim/não), lista de itens. Qual tipo para cada?`,
   narrEn:`The Museum of Values catalogs all information in the kingdom.\n\nAn apprentice needs to store: name, score, whether they're active, and a list of items.\n\nWhat type for each piece of data?`,
   narrHEn:`Name, score, active(yes/no), list of items. What type for each?`,
   hint:"str para texto, int/float para números, bool para verdadeiro/falso, list para coleções.",
   hintEn:"str for text, int/float for numbers, bool for true/false, list for collections.",
   concept:{nm:"Tipos de dados",nmEn:"Data Types",cl:"#BA7517",bg:"rgba(186,117,23,.07)",bd:"rgba(186,117,23,.22)",
    sum:"Todo valor tem um tipo: str, int, float, bool, list. O tipo define o que você pode fazer com o valor.",
    sumEn:"Every value has a type: str, int, float, bool, list. The type defines what you can do with the value.",
    py:`nome   = "Byte"      # str\npontos = 42           # int\ntemp   = 36.5         # float\nativo  = True         # bool\nitens  = ["espada"]   # list\n\ntype(nome)   # <class 'str'>\nint("42")    # 42\nstr(100)     # "100"`,
    js:`const name   = "Byte";      // string\nconst score  = 42;           // number\nconst temp   = 36.5;         // number\nconst active = true;         // boolean\nconst items  = ["sword"];    // array\n\ntypeof name;   // "string"\nNumber("42");  // 42\nString(100);   // "100"`},
   choices:[
    {text:"nome→str, pontos→int, ativo→bool, itens→list",textEn:"name→str, score→int, active→bool, items→list",good:true,
     cons:`Todos corretos!\n\n— "42"+"10"="4210" (str). 42+10=52 (int). TIPOS definem as operações.`,
     consEn:`All correct!\n\n— "42"+"10"="4210" (str). 42+10=52 (int). TYPES define the operations.`},
    {text:'Tudo como texto — é mais simples',textEn:'Everything as text — simpler that way',good:false,
     cons:`"42"+"10"="4210", não 52! Bugs matemáticos silenciosos.\n\n— Tipo errado cria problemas invisíveis.`,
     consEn:`"42"+"10"="4210", not 52! Silent mathematical bugs.\n\n— The wrong type creates invisible problems.`,
     branch:`— "42" é texto, 42 é número. Nunca confunda.`,
     branchEn:`— "42" is text, 42 is a number. Never confuse them.`}],
   quiz:{q:"Qual o tipo de 3.14 em Python?",qEn:"What is the type of 3.14 in Python?",
    opts:["str","int","float"],optsEn:["str","int","float"],ok:2}},

  {id:"espelho",ch:"Cap. 11",chEn:"Ch. 11",icon:"ti-infinity",portrait:{ic:"ti-sparkles",cl:"#378ADD",nm:"Feiticeira Anciã",nmEn:"Ancient Sorceress"},mapPos:{x:32,y:70},
   item:{icon:"ti-infinity",name:"Espelho Recursivo",nameEn:"Recursive Mirror"},
   narr:`Torre de espelhos que refletem espelhos. A feiticeira:\n\n— Calcule degraus que dobram a cada andar. Andar 1: 1. Andar N: dobro do anterior.\n\nExiste solução elegante onde a função chama a si mesma.`,
   narrH:`degraus(N) = degraus(N-1) × 2. Função que chama a si mesma?`,
   narrEn:`A tower of mirrors reflecting mirrors. The sorceress:\n\n— Calculate steps that double each floor. Floor 1: 1. Floor N: double the previous.\n\nThere's an elegant solution where the function calls itself.`,
   narrHEn:`steps(N) = steps(N-1) × 2. A function that calls itself?`,
   hint:"Uma função pode chamar a si mesma com um problema menor — isso é recursão.",
   hintEn:"A function can call itself with a smaller problem — that's recursion.",
   concept:{nm:"Recursão",nmEn:"Recursion",cl:"#378ADD",bg:"rgba(55,138,221,.07)",bd:"rgba(55,138,221,.22)",
    sum:"Recursão: função que chama a si mesma. Precisa de caso base (parada) e caso recursivo.",
    sumEn:"Recursion: a function that calls itself. Needs a base case (stop) and a recursive case.",
    py:`def degraus(n):\n    if n == 1: return 1      # caso base\n    return degraus(n-1) * 2  # recursivo\n\ndegraus(4)  # → 8\n# 1→1, 2→2, 3→4, 4→8\n\ndef fatorial(n):\n    if n == 0: return 1\n    return n * fatorial(n-1)`,
    js:`function steps(n) {\n    if (n===1) return 1;      // base case\n    return steps(n-1) * 2;   // recursive\n}\n\nsteps(4); // → 8\n\nfunction factorial(n) {\n    if (n===0) return 1;\n    return n * factorial(n-1);\n}`},
   choices:[
    {text:"Função que chama a si mesma (recursão)",textEn:"A function that calls itself (recursion)",good:true,
     cons:`Espelhos se constroem em cascata!\n\n— RECURSÃO! A função descreve o padrão matematicamente. Caso base garante a parada.`,
     consEn:`Mirrors build themselves in a cascade!\n\n— RECURSION! The function describes the pattern mathematically. Base case ensures it stops.`},
    {text:"Loop multiplicando por 2 a cada vez",textEn:"A loop multiplying by 2 each time",good:false,
     cons:`Funciona! Mas existe forma mais elegante.\n\n— Recursão expressa degraus(N) = degraus(N-1)*2 diretamente.`,
     consEn:`It works! But there's a more elegant way.\n\n— Recursion expresses steps(N) = steps(N-1)*2 directly.`,
     branch:`— Loops são eficazes. Recursão é natural para problemas que se dividem em versões menores.`,
     branchEn:`— Loops are effective. Recursion is natural for problems that divide into smaller versions.`}],
   quiz:{q:"O que é o 'caso base' na recursão?",qEn:"What is the 'base case' in recursion?",
    opts:["O primeiro parâmetro","A condição que para a recursão","O valor mais retornado"],
    optsEn:["The first parameter","The condition that stops the recursion","The most returned value"],ok:1}},

  {id:"camara",ch:"Cap. 12",chEn:"Ch. 12",icon:"ti-shield-check",portrait:{ic:"ti-shield-half",cl:"#1D9E75",nm:"Arcanista Idoso",nmEn:"Elderly Arcanist"},mapPos:{x:20,y:82},
   item:{icon:"ti-shield-check",name:"Amuleto Protetor",nameEn:"Protective Amulet"},
   narr:`A Câmara Final. O arcanista te desafia:\n\n— Sistemas recebem entradas inválidas às vezes. Um bom desenvolvedor antecipa falhas.\n\nComo proteger o código de erros inesperados sem travá-lo?`,
   narrH:`Entradas inválidas causam erros. Como proteger sem travar?`,
   narrEn:`The Final Chamber. The arcanist challenges you:\n\n— Systems receive invalid input sometimes. A good developer anticipates failures.\n\nHow do you protect code from unexpected errors without crashing?`,
   narrHEn:`Invalid input causes errors. How do you protect without crashing?`,
   hint:"Existe uma estrutura para 'tentar' e 'capturar' se falhar.",
   hintEn:"There is a structure to 'try' and 'catch' if it fails.",
   concept:{nm:"Try / Except",nmEn:"Try / Except",cl:"#1D9E75",bg:"rgba(29,158,117,.07)",bd:"rgba(29,158,117,.22)",
    sum:"Try/Except protege de erros inesperados. Tente; se falhar, capture e trate. O programa continua.",
    sumEn:"Try/Except protects against unexpected errors. Try; if it fails, catch and handle. The program continues.",
    py:`try:\n    n = int(input("Número: "))\n    print(100 / n)\nexcept ValueError:\n    print("Não é número!")\nexcept ZeroDivisionError:\n    print("Não divide por zero!")\nfinally:\n    print("Sempre executa")`,
    js:`try {\n    const n = Number(prompt("Number:"));\n    console.log(100 / n);\n} catch(e) {\n    console.log("Error:", e.message);\n} finally {\n    console.log("Always runs");\n}`},
   choices:[
    {text:"try/except para capturar o erro com elegância",textEn:"try/except to catch the error gracefully",good:true,
     cons:`Sistema absorve entrada inválida sem travar!\n\n— TRY/EXCEPT! O escudo do programador. Resiliência em código.`,
     consEn:`System absorbs invalid input without crashing!\n\n— TRY/EXCEPT! The programmer's shield. Resilience in code.`},
    {text:"Ignorar — erros são raros",textEn:"Ignore it — errors are rare",good:false,
     cons:`Na primeira entrada inválida, sistema trava completamente.\n\n— Erros ACONTECEM. Sempre. Antecipe-os.`,
     consEn:`On the first invalid input, the system crashes completely.\n\n— Errors HAPPEN. Always. Anticipate them.`,
     branch:`— try/except captura, mostra mensagem amigável e continua. Isso é resiliência.`,
     branchEn:`— try/except catches, shows a friendly message and continues. That's resilience.`}],
   quiz:{q:"O que 'finally' faz?",qEn:"What does 'finally' do?",
    opts:["Só executa se houver erro","Executa sempre, com ou sem erro","Cancela o erro"],
    optsEn:["Only runs if there's an error","Always runs, with or without an error","Cancels the error"],ok:1}},

  {id:"academia",ch:"Cap. 13",chEn:"Ch. 13",icon:"ti-school",portrait:{ic:"ti-users-group",cl:"#9F77DD",nm:"Grão-Mestre Objectus",nmEn:"Grand Master Objectus"},mapPos:{x:85,y:28},
   item:{icon:"ti-certificate",name:"Diploma da Academia",nameEn:"Academy Diploma"},
   narr:`A Academia das Classes. O Grão-Mestre explica:\n\n— Funções e dados que pertencem juntos formam uma CLASSE — molde para criar objetos.\n\nComo você modelaria vários heróis com as mesmas propriedades?`,
   narrH:`Vários heróis com nome, nível e vida. Como criar um molde reutilizável?`,
   narrEn:`The Academy of Classes. The Grand Master explains:\n\n— Functions and data that belong together form a CLASS — a template for creating objects.\n\nHow would you model multiple heroes with the same properties?`,
   narrHEn:`Multiple heroes with name, level, and health. How do you create a reusable template?`,
   hint:"Uma classe é um molde para criar objetos com as mesmas propriedades e métodos.",
   hintEn:"A class is a template for creating objects with the same properties and methods.",
   concept:{nm:"Classes (POO)",nmEn:"Classes (OOP)",cl:"#9F77DD",bg:"rgba(159,119,221,.07)",bd:"rgba(159,119,221,.22)",
    sum:"Uma classe é um molde para criar objetos (instâncias). Define propriedades e métodos compartilhados.",
    sumEn:"A class is a template for creating objects (instances). It defines shared properties and methods.",
    py:`class Heroi:\n    def __init__(self, nome, nivel):\n        self.nome = nome\n        self.nivel = nivel\n        self.vida = 100\n\n    def atacar(self):\n        return f"{self.nome} ataca!"\n\nbyte = Heroi("Byte", 1)\nbyte.atacar()  # "Byte ataca!"`,
    js:`class Hero {\n    constructor(name, level) {\n        this.name = name;\n        this.level = level;\n        this.health = 100;\n    }\n    attack() {\n        return this.name + " attacks!";\n    }\n}\n\nconst byte = new Hero("Byte", 1);\nbyte.attack(); // "Byte attacks!"`},
   choices:[
    {text:"Criar classe Heroi como molde reutilizável",textEn:"Create a Hero class as a reusable template",good:true,
     cons:`Byte, Pixel, Dev — todos do mesmo molde!\n\n— CLASSES! Instâncias compartilham estrutura, têm dados próprios.`,
     consEn:`Byte, Pixel, Dev — all from the same template!\n\n— CLASSES! Instances share structure, have their own data.`},
    {text:"Copiar e colar o objeto manualmente",textEn:"Copy and paste the object manually",good:false,
     cons:`Três heróis = três cópias. Uma mudança = editar tudo.\n\n— Classes existem para evitar exatamente isso.`,
     consEn:`Three heroes = three copies. One change = edit everything.\n\n— Classes exist to avoid exactly that.`,
     branch:`— class Heroi uma vez. new Heroi() cria quantas instâncias quiser.`,
     branchEn:`— class Hero once. new Hero() creates as many instances as you want.`}],
   quiz:{q:"O que '__init__' faz em Python?",qEn:"What does '__init__' do in Python?",
    opts:["Destrói o objeto","Inicializa ao ser criado","Lista todos os métodos"],
    optsEn:["Destroys the object","Initializes when created","Lists all methods"],ok:1}},

  {id:"mensageiro",ch:"Cap. 14",chEn:"Ch. 14",icon:"ti-clock-bolt",portrait:{ic:"ti-run",cl:"#EF9F27",nm:"Mensageiro Temporal",nmEn:"Time Messenger"},mapPos:{x:88,y:48},
   item:{icon:"ti-mail-fast",name:"Carta Assíncrona",nameEn:"Async Letter"},
   narr:`O Mensageiro Assíncrono corre entre reinos. Cada entrega demora um tempo desconhecido.\n\n— Não posso bloquear o reino inteiro esperando minha volta.\n\nComo lidar com operações que demoram?`,
   narrH:`Operação que demora tempo desconhecido. Como não bloquear o programa?`,
   narrEn:`The Async Messenger runs between kingdoms. Each delivery takes an unknown amount of time.\n\n— I can't block the entire kingdom waiting for my return.\n\nHow do you handle operations that take time?`,
   narrHEn:`An operation that takes unknown time. How do you avoid blocking the program?`,
   hint:"Use async/await para lidar com operações lentas sem bloquear o restante.",
   hintEn:"Use async/await to handle slow operations without blocking the rest.",
   concept:{nm:"Async / Await",nmEn:"Async / Await",cl:"#EF9F27",bg:"rgba(239,159,39,.07)",bd:"rgba(239,159,39,.22)",
    sum:"Async/await lida com operações que levam tempo (rede, arquivos) sem bloquear o restante do código.",
    sumEn:"Async/await handles operations that take time (network, files) without blocking the rest of the code.",
    py:`import asyncio\n\nasync def buscar_dados():\n    await asyncio.sleep(1)  # simula espera\n    return "dados prontos"\n\nasync def main():\n    resultado = await buscar_dados()\n    print(resultado)\n\nasyncio.run(main())`,
    js:`async function fetchData() {\n    const resp = await fetch("/api/data");\n    const json = await resp.json();\n    return json;\n}\n\n// Using:\nconst data = await fetchData();\nconsole.log(data);\n\n// Or with .then():\nfetchData().then(d => console.log(d));`},
   choices:[
    {text:"Usar async/await para não bloquear",textEn:"Use async/await to avoid blocking",good:true,
     cons:`O reino continua funcionando enquanto aguarda!\n\n— ASYNC/AWAIT! Operações lentas não bloqueiam o resto. await pausa só aquela tarefa.`,
     consEn:`The kingdom keeps running while waiting!\n\n— ASYNC/AWAIT! Slow operations don't block the rest. await pauses only that task.`},
    {text:"Esperar de forma síncrona (trava tudo)",textEn:"Wait synchronously (blocks everything)",good:false,
     cons:`O reino inteiro congela esperando a mensagem.\n\n— Código síncrono bloqueia. Async existe para isso.`,
     consEn:`The entire kingdom freezes waiting for the message.\n\n— Synchronous code blocks. Async exists for this.`,
     branch:`— await diz: espere isso, mas continue o resto. Nada trava.`,
     branchEn:`— await says: wait for this, but keep going with the rest. Nothing blocks.`}],
   quiz:{q:"O que 'await' faz?",qEn:"What does 'await' do?",
    opts:["Cancela a operação","Espera a Promise sem bloquear","Repete a chamada"],
    optsEn:["Cancels the operation","Waits for the Promise without blocking","Repeats the call"],ok:1}},

  {id:"feiticeiro",ch:"Cap. 15",chEn:"Ch. 15",icon:"ti-wand",portrait:{ic:"ti-sparkles",cl:"#D4537E",nm:"Feiticeiro Regex",nmEn:"Regex Sorcerer"},mapPos:{x:82,y:70},
   item:{icon:"ti-wand",name:"Varinha dos Padrões",nameEn:"Pattern Wand"},
   narr:`O Feiticeiro dos Padrões controla textos com feitiços arcanos:\n\n— Quero encontrar todo e-mail num pergaminho de 1000 linhas.\n\nComo você buscaria padrões complexos em texto?`,
   narrH:`Encontrar todos os e-mails em texto longo. Qual abordagem usar?`,
   narrEn:`The Pattern Sorcerer controls texts with arcane spells:\n\n— I want to find every email in a scroll of 1,000 lines.\n\nHow would you search for complex patterns in text?`,
   narrHEn:`Find all emails in a long text. Which approach would you use?`,
   hint:"Expressões regulares (regex) definem padrões para buscar e validar texto.",
   hintEn:"Regular expressions (regex) define patterns to search and validate text.",
   concept:{nm:"Regex",nmEn:"Regex",cl:"#D4537E",bg:"rgba(212,83,126,.07)",bd:"rgba(212,83,126,.22)",
    sum:"Regex são padrões para buscar e validar texto. Uma linha de regex substitui dezenas de verificações.",
    sumEn:"Regex are patterns for searching and validating text. One line of regex replaces dozens of checks.",
    py:`import re\n\ntexto = "Email: byte@codigo.com.br"\n\n# Encontrar emails:\npadrao = r'[\\w.]+@[\\w.]+'\nemails = re.findall(padrao, texto)\n# → ['byte@codigo.com.br']\n\n# Validar CEP:\nre.match(r'^\\d{5}-\\d{3}$', "01310-100")`,
    js:`const text = "Email: byte@code.com";\n\n// Find emails:\nconst pattern = /[\\w.]+@[\\w.]+/g;\nconst emails = text.match(pattern);\n// → ['byte@code.com']\n\n// Validate ZIP:\n/^\\d{5}(-\\d{4})?$/.test("90210");\n// → true`},
   choices:[
    {text:"Usar regex para descrever o padrão de e-mail",textEn:"Use regex to describe the email pattern",good:true,
     cons:`Todos os e-mails encontrados em milissegundos!\n\n— REGEX! Um padrão que substitui 50 linhas de código. Um superpoder.`,
     consEn:`All emails found in milliseconds!\n\n— REGEX! One pattern that replaces 50 lines of code. A superpower.`},
    {text:"Verificar manualmente linha por linha",textEn:"Manually check line by line",good:false,
     cons:`1000 linhas verificadas uma a uma. Horas.\n\n— Regex faz em uma linha o que 50 linhas fariam.`,
     consEn:`1,000 lines checked one by one. Hours of work.\n\n— Regex does in one line what 50 lines would do.`,
     branch:`— r'[\\w.]+@[\\w.]+' captura qualquer e-mail. Regex é difícil no início, poderoso para sempre.`,
     branchEn:`— [\\w.]+@[\\w.]+ captures any email. Regex is hard at first, powerful forever.`}],
   quiz:{q:"Para que serve regex?",qEn:"What is regex used for?",
    opts:["Criar classes","Buscar e validar padrões em texto","Loops eficientes"],
    optsEn:["Creating classes","Searching and validating patterns in text","Efficient loops"],ok:1}},

  {id:"biblioteca2",ch:"Cap. 16",chEn:"Ch. 16",icon:"ti-sort-ascending",portrait:{ic:"ti-books",cl:"#5DCAA5",nm:"Bibliotecária Caótica",nmEn:"Chaotic Librarian"},mapPos:{x:15,y:42},
   item:{icon:"ti-sort-ascending",name:"Índice Ordenado",nameEn:"Sorted Index"},
   narr:`A Biblioteca Caótica tem 1 milhão de livros fora de ordem. A bibliotecária:\n\n— Para organizar, existem vários algoritmos. Qual você escolhe?\n\nBubble Sort, Quicksort ou Mergesort?`,
   narrH:`1 milhão de livros fora de ordem. Qual algoritmo de ordenação usar?`,
   narrEn:`The Chaotic Library has 1 million books out of order. The librarian:\n\n— To organize them, there are several algorithms. Which do you choose?\n\nBubble Sort, Quicksort, or Mergesort?`,
   narrHEn:`1 million books out of order. Which sorting algorithm would you use?`,
   hint:"Algoritmos de ordenação têm eficiências diferentes — para dados grandes, O(n log n) é essencial.",
   hintEn:"Sorting algorithms have different efficiencies — for large data, O(n log n) is essential.",
   concept:{nm:"Algoritmos de Ordenação",nmEn:"Sorting Algorithms",cl:"#5DCAA5",bg:"rgba(93,202,165,.07)",bd:"rgba(93,202,165,.22)",
    sum:"Algoritmos de ordenação organizam dados. Cada um tem trade-offs. Para dados grandes, escolha O(n log n).",
    sumEn:"Sorting algorithms organize data. Each has trade-offs. For large data, choose O(n log n).",
    py:`# Bubble Sort — didático, O(n²)\ndef bubble(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j],arr[j+1] = arr[j+1],arr[j]\n\n# Python built-in — O(n log n)\nlista.sort()\nresult = sorted(lista)`,
    js:`// Bubble Sort — educational, O(n²)\nfunction bubble(arr) {\n    for(let i=0;i<arr.length;i++)\n        for(let j=0;j<arr.length-i-1;j++)\n            if(arr[j]>arr[j+1])\n                [arr[j],arr[j+1]]=[arr[j+1],arr[j]];\n}\n\n// Built-in — O(n log n)\narr.sort();\n[...arr].sort((a,b)=>a-b);`},
   choices:[
    {text:"Quicksort/Mergesort — O(n log n)",textEn:"Quicksort/Mergesort — O(n log n)",good:true,
     cons:`1 milhão ordenado em segundos!\n\n— O(n log n) escala. Bubble Sort em 1M itens: horas. Quicksort: milissegundos.`,
     consEn:`1 million sorted in seconds!\n\n— O(n log n) scales. Bubble Sort on 1M items: hours. Quicksort: milliseconds.`},
    {text:"Bubble Sort — fácil de entender",textEn:"Bubble Sort — easy to understand",good:false,
     cons:`3 horas depois, 1% organizado.\n\n— Bubble Sort é O(n²). Para 1M itens: impraticável.`,
     consEn:`3 hours later, 1% organized.\n\n— Bubble Sort is O(n²). For 1M items: impractical.`,
     branch:`— Bubble Sort é ótimo para aprender. Para produção: sempre O(n log n) ou melhor.`,
     branchEn:`— Bubble Sort is great for learning. For production: always O(n log n) or better.`}],
   quiz:{q:"Qual a complexidade do Bubble Sort?",qEn:"What is the complexity of Bubble Sort?",
    opts:["O(1)","O(n log n)","O(n²)"],optsEn:["O(1)","O(n log n)","O(n²)"],ok:2}},

  {id:"oraculo2",ch:"Cap. 17",chEn:"Ch. 17",icon:"ti-chart-bar",portrait:{ic:"ti-infinity",cl:"#E24B4A",nm:"Oráculo da Eficiência",nmEn:"Oracle of Efficiency"},mapPos:{x:50,y:50},
   item:{icon:"ti-chart-bar",name:"Grimório da Eficiência",nameEn:"Efficiency Grimoire"},
   narr:`O Oráculo Final avalia sua eficiência:\n\n— Dois algoritmos resolvem o mesmo problema. Um é O(n²), outro O(log n).\n\nPara n = 1.000.000: qual a diferença prática?`,
   narrH:`O(n²) vs O(log n) para n=1.000.000. Qual a diferença?`,
   narrEn:`The Final Oracle evaluates your efficiency:\n\n— Two algorithms solve the same problem. One is O(n²), the other O(log n).\n\nFor n = 1,000,000: what's the practical difference?`,
   narrHEn:`O(n²) vs O(log n) for n=1,000,000. What's the difference?`,
   hint:"Big O descreve como o tempo cresce conforme n aumenta — não meça velocidade, meça crescimento.",
   hintEn:"Big O describes how time grows as n increases — don't measure speed, measure growth.",
   concept:{nm:"Big O Notation",nmEn:"Big O Notation",cl:"#E24B4A",bg:"rgba(226,75,74,.07)",bd:"rgba(226,75,74,.22)",
    sum:"Big O descreve a eficiência de algoritmos. O(1) constante, O(log n) excelente, O(n) linear, O(n²) lento.",
    sumEn:"Big O describes algorithm efficiency. O(1) constant, O(log n) excellent, O(n) linear, O(n²) slow.",
    py:`# O(1) — constante: sempre igual\ndef primeiro(lista):\n    return lista[0]\n\n# O(n) — linear: cresce com n\ndef busca_linear(lista, alvo):\n    for item in lista:\n        if item == alvo: return True\n\n# O(log n) — logarítmico: excelente\n# busca binária: divide o problema pela metade\n\n# O(n²) — quadrático: evitar em escala\n# bubble sort: loop dentro de loop`,
    js:`// O(1) — constant\nconst first = arr[0];\n\n// O(n) — linear\nconst found = arr.find(x => x === target);\n\n// O(n log n) — great for sorting\narr.sort();\n\n// O(n²) — quadratic, avoid at scale\nfor(let i=0;i<n;i++)\n    for(let j=0;j<n;j++) ...\n// n=1M → 1 trillion operations!`},
   choices:[
    {text:"O(log n) — diferença é astronômica",textEn:"O(log n) — the difference is astronomical",good:true,
     cons:`O(n²) em 1M: 1 trilhão de ops. O(log n): ~20 ops.\n\n— BIG O! Eficiência não é detalhe — é a diferença entre possível e impossível.`,
     consEn:`O(n²) on 1M: 1 trillion ops. O(log n): ~20 ops.\n\n— BIG O! Efficiency is not a detail — it's the difference between possible and impossible.`},
    {text:"A diferença é pequena, ambos funcionam",textEn:"The difference is small, both work",good:false,
     cons:`O(n²) em 1M levaria horas. O(log n): milissegundos.\n\n— Em escala, a diferença é ASTRONÔMICA.`,
     consEn:`O(n²) on 1M would take hours. O(log n): milliseconds.\n\n— At scale, the difference is ASTRONOMICAL.`,
     branch:`— 1.000.000² = 10¹² operações vs log₂(1.000.000) ≈ 20. Isso é Big O.`,
     branchEn:`— 1,000,000² = 10¹² operations vs log₂(1,000,000) ≈ 20. That's Big O.`}],
   quiz:{q:"Qual Big O é mais eficiente?",qEn:"Which Big O is most efficient?",
    opts:["O(n²)","O(n)","O(log n)"],optsEn:["O(n²)","O(n)","O(log n)"],ok:2}},
];

// ── UI TRANSLATIONS ──────────────────────────────────────────
const UI={
  pt:{lang:"pt",langLabel:"🇧🇷 Português",subtitle:"Uma aventura de programação",
   chapters:"17 capítulos · boss fights · corrija o bug · XP persistente · multiplayer · mais",
   playSolo:"Jogar solo →",playMulti:"Multiplayer →",playDaily:"Desafio diário →",dailyToday:"Desafio de hoje:",
   settingTheme:"Tema visual",settingDiff:"Dificuldade",settingCode:"Linguagem de código",settingUILang:"Idioma",settingPlayer:"Nome do jogador",settingFont:"Tamanho do texto",
   diffInit:"Iniciante",diffHard:"Desafiador",langPy:"Python",langJs:"JavaScript",langBoth:"Ambas",
   multiTitle:"Modo Multiplayer",multiDesc:"Dois jogadores competem no mesmo dispositivo. Quem terminar com mais pontos vence!",
   player1:"Jogador 1",player2:"Jogador 2",startMulti:"Iniciar →",
   switchTitle:"Fim do turno",switchScore:"Pontuação:",switchPass:"Passe o dispositivo para",switchBtn:"Iniciar turno de",
   hintBtn:"Dica",hintFree:"(grátis)",hintCost:"(−{n} pts)",whatDo:"O que você faz?",
   goodChoice:"Boa escolha! +10 pts",badChoice:"Poderia ser melhor",
   conceptLearned:"Conceito aprendido",editCode:"Edite o código para praticar!",resetCode:"Resetar",
   animTab:"Animação",codeTab:"Código",sandboxTab:"Sandbox",
   sandboxTitle:"Sandbox — Execute código real",sandboxRun:"Executar",sandboxRunning:"Executando...",sandboxHint:"Modifique e execute!",sandboxNoOut:"(sem output — sem",skulptLoading:"carregando Skulpt...",
   bugTitle:"🐛 Corrija o Bug",bugHint:"Dica:",bugRun:"Testar correção",bugRunning:"Testando...",bugExpected:"Saída esperada:",bugGot:"Sua saída:",bugPass:"Bug corrigido! +15 pts 🎉",bugFail:"Ainda tem bug — continue tentando!",bugSkip:"Pular →",
   animPrev:"◀",animNext:"▶",animVars:"Variáveis",animOut:"Saída",animStep:"Passo",animOf:"de",animNoAnim:"Sem animação para este conceito.",
   quizTitle:"Quiz rápido",quizCheck:"Verificar →",quizRight:"+5 pontos! Correto!",quizWrong:"Não desta vez — mas agora você sabe!",quizNextCh:"Próximo capítulo →",quizFinal:"Ver resultado final →",
   sandboxNext:"Sandbox →",conceptNext:"Próximo: Sandbox →",continueBtn:"Continuar →",conceptBtn:"Ver conceito →",branchTag:"Desvio narrativo",
   bossIntro:"MINI-BOSS",bossQ:"Pergunta",bossOf:"de",bossCorrect:"Correto! +",bossWrong:"Errou — mas siga em frente!",bossWin:"Boss derrotado!",bossBonusXP:"XP bônus:",bossNext:"Próximo capítulo →",bossTime:"Tempo restante:",
   mapTitle:"Mapa do Reino do Código",mapKingdom:"Reino do Código",mapHint:"Clique em um capítulo para revisitá-lo",
   achTitle:"Conquistas",achDone:"Desbloqueado",
   lbTitle:"Placar de Líderes",lbEmpty:"Nenhuma partida ainda. Complete o jogo!",
   profileTitle:"Perfil de Desenvolvedor",profileScore:"Pontuação",profilePct:"Aproveitamento",profileAch:"Conquistas",
   profileConcepts:"Conceitos dominados",profileInv:"Inventário",profileDl:"Baixar cartão (.txt)",profileShare:"Compartilhar card",profileAvatar:"Gerar avatar IA",profileAvatarLoading:"Gerando avatar...",
   reviewTitle:"Revisão de Erros",reviewEmpty:"Nenhum erro! Você foi impecável!",reviewClose:"Fechar →",reviewQ:"Pergunta:",reviewCorrect:"Resposta correta:",
   xpLabel:"XP",xpLevel:"Nível",xpNext:"próximo nível",
   streakLabel:"streak",streakDays:"dias",streakNew:"Novo recorde!",
   endTitle:"Missão cumprida!",endReplay:"Jogar novamente",endMap:"Revisar mapa",endCheat:"Cheatsheet",endProfile:"Perfil",endLB:"Placar",endReview:"Revisar erros",
   endContinue:"Continue sua jornada aprendendo Python, JavaScript ou a linguagem que preferir!",
   endMultiWin:"— Você venceu! 🏆",endMultiLose:"— Vitória deles!",endMultiDraw:"— Empate!",
   back:"Voltar",pts:"pts",speed:"Contrarrelógio",time:"Tempo",
   grimoire:"Grimório do Desenvolvedor",grimoireConcepts:"conceitos",grimoireEmpty:"Conclua capítulos para ver conceitos aqui.",
   ranks:["Arquimago do Código","Desenvolvedor Sênior","Desenvolvedor Júnior","Aprendiz Promissor"],
   cardTitle:"TERRAS DO CÓDIGO — Cartão de Desenvolvedor",cardName:"Nome:",cardRank:"Rank:",cardScore:"Pontuação:",cardMode:"Modo:",cardDiff:"Dificuldade:",cardConcepts:"Conceitos:",cardAch:"Conquistas:",cardDate:"Data:",
   cheatTitle:"TERRAS DO CÓDIGO — Cheatsheet de Programação",
   ach:[
    {nm:"Primeiro Passo",desc:"Primeira boa escolha"},
    {nm:"Sem Bengala",desc:"Capítulo sem dicas"},
    {nm:"Mente Afiada",desc:"3 quizzes seguidos"},
    {nm:"Relâmpago",desc:"Capítulo em <25s"},
    {nm:"Poliglota",desc:"Viu Python e JS"},
    {nm:"Mão na Massa",desc:"Executou código real"},
    {nm:"Colecionador",desc:"6+ itens coletados"},
    {nm:"Impecável",desc:"Zero erros no jogo"},
    {nm:"Disciplinado",desc:"Desafio diário"},
    {nm:"Competidor",desc:"Modo multiplayer"},
    {nm:"Caçador de Bosses",desc:"Derrotou um mini-boss"},
    {nm:"Exterminador de Bugs",desc:"Corrigiu um bug"},
    {nm:"7 Dias Seguidos",desc:"Streak de 7 dias"},
    {nm:"Nível 10",desc:"Atingiu o nível 10"},
    {nm:"Completou Tudo",desc:"Todos os 17 capítulos"},
   ],
  },
  en:{lang:"en",langLabel:"🇺🇸 English",subtitle:"A programming adventure",
   chapters:"17 chapters · boss fights · fix the bug · persistent XP · multiplayer · more",
   playSolo:"Play solo →",playMulti:"Multiplayer →",playDaily:"Daily challenge →",dailyToday:"Today's challenge:",
   settingTheme:"Visual theme",settingDiff:"Difficulty",settingCode:"Code language",settingUILang:"Language",settingPlayer:"Player name",settingFont:"Text size",
   diffInit:"Beginner",diffHard:"Challenging",langPy:"Python",langJs:"JavaScript",langBoth:"Both",
   multiTitle:"Multiplayer Mode",multiDesc:"Two players compete on the same device. Highest score wins!",
   player1:"Player 1",player2:"Player 2",startMulti:"Start →",
   switchTitle:"Turn over",switchScore:"Score:",switchPass:"Pass the device to",switchBtn:"Start turn for",
   hintBtn:"Hint",hintFree:"(free)",hintCost:"(−{n} pts)",whatDo:"What do you do?",
   goodChoice:"Good choice! +10 pts",badChoice:"Could be better",
   conceptLearned:"Concept learned",editCode:"Edit the code to practice!",resetCode:"Reset",
   animTab:"Animation",codeTab:"Code",sandboxTab:"Sandbox",
   sandboxTitle:"Sandbox — Run real code",sandboxRun:"Run",sandboxRunning:"Running...",sandboxHint:"Modify and run freely!",sandboxNoOut:"(no output — no",skulptLoading:"loading Skulpt...",
   bugTitle:"🐛 Fix the Bug",bugHint:"Hint:",bugRun:"Test fix",bugRunning:"Testing...",bugExpected:"Expected output:",bugGot:"Your output:",bugPass:"Bug fixed! +15 pts 🎉",bugFail:"Still buggy — keep trying!",bugSkip:"Skip →",
   animPrev:"◀",animNext:"▶",animVars:"Variables",animOut:"Output",animStep:"Step",animOf:"of",animNoAnim:"No animation for this concept.",
   quizTitle:"Quick quiz",quizCheck:"Check →",quizRight:"+5 points! Correct!",quizWrong:"Not this time — but now you know!",quizNextCh:"Next chapter →",quizFinal:"See final result →",
   sandboxNext:"Sandbox →",conceptNext:"Next: Sandbox →",continueBtn:"Continue →",conceptBtn:"See concept →",branchTag:"Narrative branch",
   bossIntro:"MINI-BOSS",bossQ:"Question",bossOf:"of",bossCorrect:"Correct! +",bossWrong:"Wrong — but keep going!",bossWin:"Boss defeated!",bossBonusXP:"Bonus XP:",bossNext:"Next chapter →",bossTime:"Time left:",
   mapTitle:"Map of the Code Kingdom",mapKingdom:"Code Kingdom",mapHint:"Click a chapter to revisit it",
   achTitle:"Achievements",achDone:"Unlocked",
   lbTitle:"Leaderboard",lbEmpty:"No matches yet. Finish the game!",
   profileTitle:"Developer Profile",profileScore:"Score",profilePct:"Performance",profileAch:"Achievements",
   profileConcepts:"Mastered concepts",profileInv:"Inventory",profileDl:"Download card (.txt)",profileShare:"Share card",profileAvatar:"Generate AI avatar",profileAvatarLoading:"Generating avatar...",
   reviewTitle:"Error Review",reviewEmpty:"No errors! You were flawless!",reviewClose:"Close →",reviewQ:"Question:",reviewCorrect:"Correct answer:",
   xpLabel:"XP",xpLevel:"Level",xpNext:"next level",
   streakLabel:"streak",streakDays:"days",streakNew:"New record!",
   endTitle:"Mission accomplished!",endReplay:"Play again",endMap:"Review map",endCheat:"Cheatsheet",endProfile:"Profile",endLB:"Leaderboard",endReview:"Review errors",
   endContinue:"Continue your journey learning Python, JavaScript, or any language you prefer!",
   endMultiWin:"— You won! 🏆",endMultiLose:"— They won!",endMultiDraw:"— It's a tie!",
   back:"Back",pts:"pts",speed:"Speed Run",time:"Time",
   grimoire:"Developer Grimoire",grimoireConcepts:"concepts",grimoireEmpty:"Complete chapters to see concepts here.",
   ranks:["Code Archmage","Senior Developer","Junior Developer","Promising Apprentice"],
   cardTitle:"LANDS OF CODE — Developer Card",cardName:"Name:",cardRank:"Rank:",cardScore:"Score:",cardMode:"Mode:",cardDiff:"Difficulty:",cardConcepts:"Concepts:",cardAch:"Achievements:",cardDate:"Date:",
   cheatTitle:"LANDS OF CODE — Programming Cheatsheet",
   ach:[
    {nm:"First Step",desc:"First good choice"},
    {nm:"No Crutches",desc:"Chapter without hints"},
    {nm:"Sharp Mind",desc:"3 quizzes in a row"},
    {nm:"Lightning",desc:"Chapter in <25s"},
    {nm:"Polyglot",desc:"Saw Python and JS"},
    {nm:"Hands On",desc:"Ran real code"},
    {nm:"Collector",desc:"6+ items collected"},
    {nm:"Flawless",desc:"Zero errors"},
    {nm:"Disciplined",desc:"Daily challenge"},
    {nm:"Competitor",desc:"Multiplayer mode"},
    {nm:"Boss Slayer",desc:"Defeated a mini-boss"},
    {nm:"Bug Exterminator",desc:"Fixed a bug"},
    {nm:"7-Day Streak",desc:"7 day streak"},
    {nm:"Level 10",desc:"Reached level 10"},
    {nm:"All Chapters",desc:"All 17 chapters"},
   ],
  },
};

// ── UTILITY COMPONENTS ───────────────────────────────────────
function NBtn({children,onClick,disabled,T}){const[h,sh]=useState(false);return(<button onClick={onClick} disabled={disabled} onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)} style={{background:"transparent",border:`0.5px solid ${disabled?T.ab:T.am}`,color:disabled?T.mt:T.am,padding:"0.6rem 1.4rem",fontSize:"0.88rem",fontFamily:"Georgia,serif",cursor:disabled?"default":"pointer",borderRadius:"6px",opacity:h&&!disabled?1:0.85,transition:"opacity 0.2s"}}>{children}</button>);}
function CBtn({children,onClick,T}){const[h,sh]=useState(false);return(<button onClick={onClick} onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)} style={{background:h?T.al:"transparent",border:`0.5px solid ${h?T.am:T.ab}`,color:T.tx,padding:"0.85rem 1.1rem",textAlign:"left",cursor:"pointer",borderRadius:"8px",fontSize:"0.92rem",fontFamily:"Georgia,serif",lineHeight:1.5,width:"100%",transition:"all 0.18s"}}><i className="ti ti-arrow-right" style={{fontSize:13,marginRight:8,color:T.am,verticalAlign:"-1px"}} aria-hidden="true"/>{children}</button>);}
function ProgBar({idx,total,T}){return(<div style={{display:"flex",gap:4,marginBottom:"1.5rem"}}>{Array.from({length:total},(_,i)=>(<div key={i} style={{flex:1,height:3,borderRadius:99,background:i<idx?T.am:i===idx?"rgba(239,159,39,0.4)":"rgba(239,159,39,0.12)",transition:"background 0.5s"}}/>))}</div>);}
function Portrait({p,lang,T}){const nm=lang==="en"?(p.nmEn||p.nm):p.nm;return(<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1rem"}}><div style={{width:36,height:36,borderRadius:"50%",background:"rgba(127,119,221,0.15)",border:`0.5px solid ${T.ab}`,display:"flex",alignItems:"center",justifyContent:"center"}}><i className={`ti ${p.ic}`} style={{fontSize:16,color:p.cl}} aria-hidden="true"/></div><span style={{fontSize:12,color:T.mt,fontFamily:"Georgia,serif",fontStyle:"italic"}}>{nm}</span></div>);}
function AchToast({ach,T,onClose}){useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t);},[]);return(<div style={{position:"fixed",top:20,right:20,zIndex:999,background:T.sf,border:`0.5px solid ${T.am}`,borderRadius:8,padding:"0.75rem 1rem",maxWidth:240}}><div style={{display:"flex",alignItems:"center",gap:8}}><i className={`ti ${ach.icon}`} style={{fontSize:18,color:T.am}} aria-hidden="true"/><div><div style={{fontSize:12,color:T.am,fontWeight:500}}>{ach.nm}</div><div style={{fontSize:11,color:T.mt}}>{ach.desc}</div></div></div></div>);}
function TimerBar({secs,max,T,L}){const pct=Math.round((secs/max)*100);const cl=secs<10?T.cr:secs<20?T.am:T.gn;return(<div style={{marginBottom:"0.75rem"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:cl,fontFamily:"Georgia,serif"}}><i className="ti ti-clock" style={{fontSize:11,marginRight:4}} aria-hidden="true"/>{L.time}</span><span style={{fontSize:13,fontWeight:500,color:cl}}>{secs}s</span></div><div style={{height:4,background:T.al,borderRadius:99,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:cl,transition:"width 1s linear",borderRadius:99}}/></div></div>);}

function XPBar({xpData,lang,T,L}){
  const{lvl,pct,xp,next}=xpData;
  const title=lang==="en"?xpData.enTi:xpData.ptTi;
  return(<div style={{marginBottom:"0.75rem"}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
      <span style={{fontSize:11,color:T.am,fontFamily:"Georgia,serif"}}><i className="ti ti-trending-up" style={{fontSize:11,marginRight:4}} aria-hidden="true"/>{L.xpLevel} {lvl} — {title}</span>
      <span style={{fontSize:10,color:T.mt}}>{xp} {L.xpLabel}{next?` / ${next.xp}`:""}</span>
    </div>
    <div style={{height:3,background:T.al,borderRadius:99,overflow:"hidden"}}>
      <div style={{width:`${pct}%`,height:"100%",background:T.am,borderRadius:99,transition:"width 0.8s ease"}}/>
    </div>
  </div>);}

function StreakBadge({streak,T,L}){
  if(!streak||streak<2)return null;
  return(<span style={{fontSize:10,background:"rgba(216,90,48,.12)",border:`0.5px solid rgba(216,90,48,.35)`,color:T.cr,padding:"2px 8px",borderRadius:4,display:"inline-flex",alignItems:"center",gap:4}}>
    <i className="ti ti-flame" style={{fontSize:11}} aria-hidden="true"/>
    {streak} {L.streakDays}
  </span>);}

// ── CODE ANIMATION ───────────────────────────────────────────
function CodeAnim({sceneId,lang,T,L}){
  const steps=ANIM_STEPS[sceneId];
  const[step,setStep]=useState(0);
  if(!steps)return(<p style={{fontSize:12,color:T.mt,fontFamily:"Georgia,serif",padding:"0.5rem 0"}}>{L.animNoAnim}</p>);
  const s=steps[step];
  return(<div>
    <div style={{background:T.cb,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.9rem 1.1rem",marginBottom:8}}>
      <pre style={{fontFamily:"Courier New,monospace",fontSize:"0.82rem",color:"#b8dfa0",margin:0,lineHeight:1.7}}>{s.code}</pre>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:8}}>
      <div style={{flex:1,background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.6rem 0.9rem"}}>
        <div style={{fontSize:10,letterSpacing:2,color:T.am,textTransform:"uppercase",marginBottom:4}}>{L.animVars}</div>
        {Object.entries(s.vars).map(([k,v])=>(
          <div key={k} style={{fontSize:12,fontFamily:"Courier New,monospace",color:T.tx,marginBottom:2}}>
            <span style={{color:T.am}}>{k}</span> = <span style={{color:T.gn}}>{JSON.stringify(v)}</span>
          </div>
        ))}
        {!Object.keys(s.vars).length&&<span style={{fontSize:11,color:T.mt}}>—</span>}
      </div>
      {s.out&&<div style={{background:"rgba(93,202,165,.07)",border:`0.5px solid rgba(93,202,165,.3)`,borderRadius:6,padding:"0.6rem 0.9rem",minWidth:80}}>
        <div style={{fontSize:10,letterSpacing:2,color:T.gn,textTransform:"uppercase",marginBottom:4}}>{L.animOut}</div>
        <pre style={{fontFamily:"Courier New,monospace",fontSize:12,color:T.gn,margin:0}}>{s.out}</pre>
      </div>}
    </div>
    <p style={{fontSize:12,color:T.am,marginBottom:8,fontFamily:"Georgia,serif"}}>{s.desc[lang]||s.desc.pt}</p>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,padding:"3px 10px",borderRadius:4,cursor:step===0?"default":"pointer",fontSize:13}}>{L.animPrev}</button>
      <span style={{fontSize:11,color:T.mt,fontFamily:"Georgia,serif"}}>{L.animStep} {step+1} {L.animOf} {steps.length}</span>
      <div style={{flex:1,height:2,background:T.al,borderRadius:99}}><div style={{width:`${((step+1)/steps.length)*100}%`,height:"100%",background:T.am,borderRadius:99,transition:"width 0.3s"}}/></div>
      <button onClick={()=>setStep(s=>Math.min(steps.length-1,s+1))} disabled={step===steps.length-1} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,padding:"3px 10px",borderRadius:4,cursor:step===steps.length-1?"default":"pointer",fontSize:13}}>{L.animNext}</button>
    </div>
  </div>);}

// ── BOSS CHALLENGE ───────────────────────────────────────────
function BossChallenge({boss,lang,T,L,onDone,addXP}){
  const[started,setStarted]=useState(false);
  const[qIdx,setQIdx]=useState(0);const[sel,setSel]=useState(null);const[rev,setRev]=useState(false);
  const[correct,setCorrect]=useState(0);const[timer,setTimer]=useState(30);const timerRef=useRef(null);
  const q=boss.questions[qIdx];
  const question=lang==="en"?(q.qEn||q.q):q.q;
  const opts=lang==="en"?(q.optsEn||q.opts):q.opts;
  const title=lang==="en"?(boss.enTitle||boss.ptTitle):boss.ptTitle;
  const intro=lang==="en"?(boss.enIntro||boss.ptIntro):boss.ptIntro;

  useEffect(()=>{
    if(!started)return;
    setTimer(30);setSel(null);setRev(false);
    timerRef.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(timerRef.current);setRev(true);return 0;}return t-1;}),1000);
    return()=>clearInterval(timerRef.current);
  },[qIdx,started]);

  const pick=(i)=>{clearInterval(timerRef.current);setSel(i);setRev(true);if(i===q.ok)setCorrect(c=>c+1);};
  const next=()=>{if(qIdx<boss.questions.length-1){setQIdx(i=>i+1);}else{const pts=correct*15;addXP(boss.xpBonus);onDone(pts);}};

  if(!started)return(
    <div style={{textAlign:"center",paddingTop:"1.5rem"}}>
      <div style={{fontSize:40,marginBottom:"0.75rem"}}><i className={`ti ${boss.icon}`} style={{color:T.cr}} aria-hidden="true"/></div>
      <p style={{fontSize:10,letterSpacing:3,color:T.cr,textTransform:"uppercase",marginBottom:"0.5rem"}}>{L.bossIntro}</p>
      <h2 style={{fontSize:"1.3rem",fontWeight:"normal",color:T.tx,marginBottom:"1rem",fontFamily:"Georgia,serif"}}>{title}</h2>
      <p style={{fontSize:"0.9rem",color:T.mt,marginBottom:"1.5rem",fontFamily:"Georgia,serif",lineHeight:1.7,maxWidth:380,margin:"0 auto 1.5rem"}}>{intro}</p>
      <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:"1.5rem"}}>
        {boss.questions.map((_,i)=><div key={i} style={{width:32,height:32,borderRadius:"50%",background:T.al,border:`0.5px solid ${T.ab}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:T.mt}}>Q{i+1}</div>)}
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <NBtn onClick={()=>{setStarted(true);}} T={T}><i className="ti ti-sword" style={{fontSize:12,marginRight:6}} aria-hidden="true"/>{L.bossNext.replace("→","").trim()} →</NBtn>
        <NBtn onClick={()=>onDone(0)} T={T}>{lang==="en"?"Skip boss":"Pular boss"}</NBtn>
      </div>
    </div>);

  if(rev&&qIdx===boss.questions.length-1&&sel!==null)return(
    <div style={{textAlign:"center",paddingTop:"1.5rem"}}>
      <i className="ti ti-trophy" style={{fontSize:40,color:T.am,display:"block",marginBottom:"0.75rem"}} aria-hidden="true"/>
      <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.5rem"}}>{L.bossWin}</p>
      <p style={{fontSize:"1.1rem",color:T.tx,marginBottom:"0.5rem",fontFamily:"Georgia,serif"}}>{correct}/{boss.questions.length} corretas · {correct*15} pts</p>
      <p style={{fontSize:12,color:T.gn,marginBottom:"1.5rem"}}>{L.bossBonusXP} +{boss.xpBonus} XP</p>
      <NBtn onClick={next} T={T}>{L.bossNext}</NBtn>
    </div>);

  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1rem"}}>
      <span style={{fontSize:10,letterSpacing:2,color:T.cr,textTransform:"uppercase"}}>{L.bossQ} {qIdx+1} {L.bossOf} {boss.questions.length}</span>
      <span style={{fontSize:11,color:timer<10?T.cr:T.mt}}>{L.bossTime} {timer}s</span>
    </div>
    <div style={{height:3,background:T.al,borderRadius:99,marginBottom:"1rem",overflow:"hidden"}}><div style={{width:`${(timer/30)*100}%`,height:"100%",background:timer<10?T.cr:T.am,transition:"width 1s linear",borderRadius:99}}/></div>
    <p style={{fontSize:"1rem",color:T.tx,marginBottom:"1.25rem",fontFamily:"Georgia,serif",lineHeight:1.7}}>{question}</p>
    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:"1rem"}}>
      {opts.map((o,i)=>{let bd=T.ab,bg="transparent",tc=T.tx;if(rev){if(i===q.ok){bd="rgba(93,202,165,.5)";bg="rgba(93,202,165,.08)";tc=T.gn;}else if(i===sel){bd="rgba(216,90,48,.5)";bg="rgba(216,90,48,.08)";tc=T.cr;}}else if(i===sel){bd=T.am;bg=T.al;}return(<button key={i} onClick={()=>!rev&&pick(i)} style={{background:bg,border:`0.5px solid ${bd}`,color:tc,padding:"0.75rem 1rem",textAlign:"left",cursor:rev?"default":"pointer",borderRadius:8,fontSize:"0.9rem",fontFamily:"Georgia,serif",lineHeight:1.5}}>{o}</button>);})}
    </div>
    {rev&&<div>
      <p style={{fontSize:13,color:sel===q.ok?T.gn:T.mt,marginBottom:"1rem",fontFamily:"Georgia,serif"}}>{sel===q.ok?`${L.bossCorrect}15 pts`:L.bossWrong}</p>
      <NBtn onClick={next} T={T}>{qIdx<boss.questions.length-1?`${L.bossQ} ${qIdx+2} →`:L.bossWin+" →"}</NBtn>
    </div>}
  </div>);}

// ── FIX THE BUG ──────────────────────────────────────────────
function FixBug({scene,T,L,onNext,addScore,onAchieve}){
  const bug=BUGS.find(b=>b.id===scene.id);
  const[code,setCode]=useState(bug?.broken||"");
  const[out,setOut]=useState("");const[pass,setPass]=useState(false);
  const[running,setRunning]=useState(false);const[skulptReady,setSkulptReady]=useState(!!window.Sk);
  const[tried,setTried]=useState(false);
  const ptHint=bug?.ptHint||"";const enHint=bug?.enHint||"";
  const hint=L.lang==="en"?enHint:ptHint;
  const title=L.lang==="en"?(bug?.enTitle||bug?.ptTitle||"Fix the Bug"):bug?.ptTitle||"Corrija o Bug";
  const expected=bug?.expected||"";

  useEffect(()=>{if(!window.Sk){const s1=document.createElement("script");s1.src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js";s1.onload=()=>{const s2=document.createElement("script");s2.src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js";s2.onload=()=>setSkulptReady(true);document.head.appendChild(s2);};document.head.appendChild(s1);}else setSkulptReady(true);},[]);

  const runTest=()=>{
    if(!bug)return;setRunning(true);setTried(true);let o="";
    if(!window.Sk){setOut(L.skulptLoading);setRunning(false);return;}
    window.Sk.configure({output:t=>{o+=t;},read:f=>{if(window.Sk.builtinFiles?.files[f])return window.Sk.builtinFiles.files[f];throw f;}});
    window.Sk.misceval.asyncToPromise(()=>window.Sk.importMainWithBody("<stdin>",false,code,true))
      .then(()=>{const trimOut=o.trim();const trimExp=(bug.expected||"").trim();const ok=trimOut===trimExp;setOut(trimOut);setPass(ok);if(ok){addScore(15);onAchieve("bug_fixer");}})
      .catch(e=>setOut("Erro: "+e.toString()))
      .finally(()=>setRunning(false));
  };

  if(!bug)return(<div><p style={{fontSize:13,color:T.mt,fontFamily:"Georgia,serif",marginBottom:"1rem"}}>Sem desafio de bug para este capítulo.</p><NBtn onClick={onNext} T={T}>{L.bugSkip}</NBtn></div>);

  return(<div>
    <p style={{fontSize:10,letterSpacing:3,color:T.cr,textTransform:"uppercase",marginBottom:"0.5rem"}}><i className="ti ti-bug" style={{fontSize:13,marginRight:6,verticalAlign:"-1px"}} aria-hidden="true"/>{L.bugTitle} — {title}</p>
    <div style={{background:"rgba(216,90,48,.05)",border:`0.5px solid rgba(216,90,48,.2)`,borderRadius:6,padding:"0.6rem 0.9rem",marginBottom:"0.85rem",fontSize:12,color:T.cr,fontFamily:"Georgia,serif"}}><i className="ti ti-bulb" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.bugHint} {hint}</div>
    <textarea value={code} onChange={e=>setCode(e.target.value)} style={{width:"100%",background:T.cb,border:`0.5px solid ${pass?"rgba(93,202,165,.5)":"rgba(216,90,48,.35)"}`,borderRadius:6,padding:"0.9rem 1.1rem",fontFamily:"Courier New,monospace",fontSize:"0.8rem",color:"#f4a0a0",lineHeight:1.78,resize:"vertical",minHeight:130,boxSizing:"border-box",outline:"none",marginBottom:8}}/>
    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:"0.75rem"}}>
      <button onClick={runTest} disabled={running||!skulptReady} style={{background:"rgba(216,90,48,.1)",border:`0.5px solid rgba(216,90,48,.4)`,color:T.cr,padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif",display:"flex",alignItems:"center",gap:6}}><i className="ti ti-player-play" style={{fontSize:13}} aria-hidden="true"/>{running?L.bugRunning:L.bugRun}</button>
      {!skulptReady&&<span style={{fontSize:10,color:T.mt}}>{L.skulptLoading}</span>}
    </div>
    {tried&&<div style={{marginBottom:"1rem"}}>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:120,background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.6rem 0.9rem"}}>
          <div style={{fontSize:10,color:T.mt,marginBottom:3}}>{L.bugExpected}</div>
          <pre style={{fontFamily:"Courier New,monospace",fontSize:11,color:T.gn,margin:0}}>{expected}</pre>
        </div>
        <div style={{flex:1,minWidth:120,background:T.sf,border:`0.5px solid ${pass?"rgba(93,202,165,.4)":"rgba(216,90,48,.3)"}`,borderRadius:6,padding:"0.6rem 0.9rem"}}>
          <div style={{fontSize:10,color:T.mt,marginBottom:3}}>{L.bugGot}</div>
          <pre style={{fontFamily:"Courier New,monospace",fontSize:11,color:pass?T.gn:T.cr,margin:0}}>{out||"—"}</pre>
        </div>
      </div>
      {pass&&<p style={{fontSize:13,color:T.gn,marginTop:8,fontFamily:"Georgia,serif"}}>{L.bugPass}</p>}
      {!pass&&out&&<p style={{fontSize:13,color:T.mt,marginTop:8,fontFamily:"Georgia,serif"}}>{L.bugFail}</p>}
    </div>}
    <div style={{display:"flex",gap:8}}>
      {pass&&<NBtn onClick={onNext} T={T}>{L.quizNextCh}</NBtn>}
      <button onClick={onNext} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:12,fontFamily:"Georgia,serif"}}>{L.bugSkip}</button>
    </div>
  </div>);}

// ── REVIEW ERRORS ────────────────────────────────────────────
function ReviewErrors({errors,lang,T,L,onClose}){
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}>
      <button onClick={onClose} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button>
      <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.reviewTitle}</p>
    </div>
    {!errors.length?<p style={{fontSize:13,color:T.gn,fontFamily:"Georgia,serif"}}>{L.reviewEmpty}</p>:
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {errors.map((e,i)=>{
        const q=lang==="en"?(e.quiz.qEn||e.quiz.q):e.quiz.q;
        const opts=lang==="en"?(e.quiz.optsEn||e.quiz.opts):e.quiz.opts;
        const correct=opts[e.quiz.ok];
        const chosen=opts[e.chosen];
        const title=lang==="en"?(e.titleEn||e.title||""):e.title||"";
        return(<div key={i} style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"1rem"}}>
          <div style={{fontSize:10,letterSpacing:2,color:T.cr,textTransform:"uppercase",marginBottom:4}}>{title}</div>
          <p style={{fontSize:13,color:T.tx,marginBottom:6,fontFamily:"Georgia,serif"}}><strong>{L.reviewQ}</strong> {q}</p>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <span style={{fontSize:12,background:"rgba(216,90,48,.08)",border:"0.5px solid rgba(216,90,48,.3)",color:T.cr,padding:"4px 10px",borderRadius:4}}><i className="ti ti-x" style={{fontSize:11,marginRight:5}} aria-hidden="true"/>Você: {chosen}</span>
            <span style={{fontSize:12,background:"rgba(93,202,165,.08)",border:"0.5px solid rgba(93,202,165,.3)",color:T.gn,padding:"4px 10px",borderRadius:4}}><i className="ti ti-check" style={{fontSize:11,marginRight:5}} aria-hidden="true"/>{L.reviewCorrect} {correct}</span>
          </div>
        </div>);
      })}
    </div>}
  </div>);}

// ── AI AVATAR ─────────────────────────────────────────────────
function AIAvatar({name,rank,T,L}){
  const[avatar,setAvatar]=useState(()=>{try{return localStorage.getItem(`tdc_avatar_${name}`)||"";}catch{return "";}});
  const[loading,setLoading]=useState(false);
  const generate=async()=>{
    setLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:300,
          messages:[{role:"user",content:`Create a unique 8-line ASCII art avatar (max 20 chars wide) for a programmer named "${name}" who achieved rank "${rank}". Use only printable ASCII + unicode box-drawing/geometric characters. Make it creative and programmer-themed. Return ONLY the ASCII art, no explanation, no backticks.`}]
        })
      });
      const data=await res.json();
      const art=data.content?.find(b=>b.type==="text")?.text||"";
      setAvatar(art);
      try{localStorage.setItem(`tdc_avatar_${name}`,art);}catch{}
    }catch(e){setAvatar("Erro ao gerar — tente novamente");}
    setLoading(false);
  };
  return(<div style={{marginBottom:"1rem"}}>
    {avatar?<pre style={{fontFamily:"Courier New,monospace",fontSize:"0.78rem",color:T.am,background:T.cb,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.85rem",lineHeight:1.6,marginBottom:8,overflowX:"auto"}}>{avatar}</pre>:null}
    <button onClick={generate} disabled={loading} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:loading?T.mt:T.am,padding:"4px 12px",borderRadius:6,cursor:loading?"default":"pointer",fontSize:12,fontFamily:"Georgia,serif"}}>
      <i className="ti ti-sparkles" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>
      {loading?L.profileAvatarLoading:L.profileAvatar}
    </button>
  </div>);}

// ── SHARE CARD ────────────────────────────────────────────────
function shareCard({name,rank,score,maxScore,pct,concepts,lang,T}){
  const canvas=document.createElement("canvas");
  canvas.width=600;canvas.height=320;
  const ctx=canvas.getContext("2d");
  const bg=T.bg;const am=T.am;const tx=T.tx;const sf=T.sf;const mt=T.mt;const gn=T.gn;
  ctx.fillStyle=bg;ctx.fillRect(0,0,600,320);
  ctx.fillStyle=am+"22";ctx.fillRect(0,0,600,4);
  ctx.fillStyle=am;ctx.fillRect(0,0,600,4);
  ctx.fillStyle=sf;ctx.beginPath();ctx.roundRect(30,20,540,280,12);ctx.fill();
  ctx.strokeStyle=am+"40";ctx.lineWidth=1;ctx.stroke();
  ctx.fillStyle=am;ctx.font="bold 11px monospace";ctx.fillText(lang==="en"?"LANDS OF CODE":"TERRAS DO CÓDIGO",50,52);
  ctx.fillStyle=tx;ctx.font="bold 26px Georgia";ctx.fillText(name||"Byte",50,88);
  ctx.fillStyle=am;ctx.font="13px Georgia";ctx.fillText(rank,50,112);
  ctx.fillStyle=am+"30";ctx.fillRect(50,130,500,2);
  ctx.fillStyle=tx;ctx.font="13px sans-serif";
  ctx.fillText(`${lang==="en"?"Score":"Pontuação"}: ${score}/${maxScore} (${pct}%)`,50,158);
  ctx.fillStyle=gn;ctx.font="12px monospace";
  const conceptLine=(concepts||[]).slice(0,6).join(" · ");
  ctx.fillText(conceptLine,50,182);
  const barW=500;const barH=8;const barY=200;
  ctx.fillStyle=am+"25";ctx.beginPath();ctx.roundRect(50,barY,barW,barH,4);ctx.fill();
  ctx.fillStyle=pct>=70?gn:am;ctx.beginPath();ctx.roundRect(50,barY,barW*(pct/100),barH,4);ctx.fill();
  ctx.fillStyle=mt;ctx.font="11px monospace";
  ctx.fillText(new Date().toLocaleDateString(),50,234);
  ctx.fillStyle=am;ctx.font="bold 11px monospace";ctx.textAlign="right";
  ctx.fillText("terrasDocodigo.dev",550,234);
  const url=canvas.toDataURL("image/png");
  const a=document.createElement("a");a.href=url;a.download="developer-card.png";a.click();
}

// ── MAP / ACH / LB / PROFILE ──────────────────────────────────
function MapScreen({scenes,inventory,onJump,onBack,T,L}){return(<div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.mapTitle}</p></div><div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"1rem"}}><svg viewBox="0 0 100 100" style={{width:"100%",height:"auto",display:"block"}}><rect width="100" height="100" fill={T.bg} rx="4"/><text x="50" y="8" textAnchor="middle" fontSize="3.5" fill={T.am} fontFamily="Georgia,serif">{L.mapKingdom}</text>{scenes.map((sc,i)=>{if(!i)return null;const p=scenes[i-1];return<line key={i} x1={p.mapPos.x} y1={p.mapPos.y} x2={sc.mapPos.x} y2={sc.mapPos.y} stroke={T.ab} strokeWidth="0.5"/>})}{scenes.map((sc,i)=>{const done=inventory.find(s=>s.id===sc.id);const cl=done?T.gn:T.mt;return(<g key={sc.id} onClick={()=>onJump(i)} style={{cursor:"pointer"}}><circle cx={sc.mapPos.x} cy={sc.mapPos.y} r="3.5" fill={done?T.gn:T.sf} stroke={done?T.gn:T.ab} strokeWidth="0.5"/><text x={sc.mapPos.x} y={sc.mapPos.y-5} textAnchor="middle" fontSize="2.2" fill={cl} fontFamily="Georgia,serif">{sc.ch}</text>{done&&<text x={sc.mapPos.x} y={sc.mapPos.y+0.8} textAnchor="middle" fontSize="2.5" fill={T.bg}>✓</text>}</g>);})}</svg><p style={{fontSize:11,color:T.mt,textAlign:"center",marginTop:"0.5rem",fontFamily:"Georgia,serif"}}>{L.mapHint}</p></div></div>);}

function AchScreen({unlocked,T,L,onBack}){return(<div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.achTitle}</p></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:8}}>{ACH_IDS.map((id,i)=>{const got=unlocked.includes(id);const a=L.ach[i]||{nm:id,desc:""};return(<div key={id} style={{background:got?T.al:T.sf,border:`0.5px solid ${got?T.am:T.ab}`,borderRadius:8,padding:"0.85rem",opacity:got?1:0.45}}><i className={`ti ${ACH_ICONS[i]}`} style={{fontSize:20,color:got?T.am:T.mt,display:"block",marginBottom:6}} aria-hidden="true"/><div style={{fontSize:13,fontWeight:500,color:T.tx,marginBottom:3}}>{a.nm}</div><div style={{fontSize:11,color:T.mt}}>{a.desc}</div>{got&&<div style={{fontSize:10,color:T.gn,marginTop:5}}><i className="ti ti-check" style={{fontSize:10,marginRight:3}} aria-hidden="true"/>{L.achDone}</div>}</div>);})}</div></div>);}

function LeaderBoard({playerName,T,L,onBack}){const[sc]=useState(()=>{try{return JSON.parse(localStorage.getItem("tdc_lb")||"[]");}catch{return[];}});return(<div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.lbTitle}</p></div>{!sc.length?<p style={{color:T.mt,fontFamily:"Georgia,serif",fontSize:13}}>{L.lbEmpty}</p>:<div style={{display:"flex",flexDirection:"column",gap:6}}>{sc.slice(0,10).map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,background:s.name===playerName?T.al:T.sf,border:`0.5px solid ${s.name===playerName?T.am:T.ab}`,borderRadius:8,padding:"0.75rem 1rem"}}><span style={{fontSize:16,fontWeight:500,color:T.am,minWidth:24}}>#{i+1}</span><div style={{flex:1}}><div style={{fontSize:13,color:T.tx}}>{s.name}</div><div style={{fontSize:11,color:T.mt}}>{s.mode} · {new Date(s.date).toLocaleDateString()}</div></div><span style={{fontSize:15,fontWeight:500,color:T.am}}>{s.score}{L.pts}</span></div>)}</div>}</div>);}

function ProfileScreen({name,score,maxScore,learned,unlocked,inventory,difficulty,mode,xpData,streak,T,L,lang,onBack}){
  const pct=Math.round((score/maxScore)*100);const ri=pct>=90?0:pct>=70?1:pct>=50?2:3;
  const rank=L.ranks[ri];const today=new Date().toLocaleDateString();
  const xpTitle=lang==="en"?xpData.enTi:xpData.ptTi;
  const concepts=learned.map(c=>lang==="en"?(c.nmEn||c.nm):c.nm);
  const dlCard=()=>{const t=`${L.cardTitle}\n${"─".repeat(40)}\n${L.cardName} ${name}\n${L.cardRank} ${rank}\n${L.cardScore} ${score}/${maxScore} (${pct}%)\n${L.cardConcepts} ${concepts.join(", ")}\n${L.cardAch} ${unlocked.length}/${ACH_IDS.length}\n${L.xpLevel} ${xpData.lvl} — ${xpTitle} (${xpData.xp} XP)\n${L.streakLabel}: ${streak} ${L.streakDays}\n${L.cardDate} ${today}`;const b=new Blob([t],{type:"text/plain"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="developer-card.txt";a.click();};
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.profileTitle}</p></div>
    <div style={{background:T.sf,border:`0.5px solid ${T.am}`,borderRadius:12,padding:"1.5rem",marginBottom:"1rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:"1.25rem"}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:T.al,border:`0.5px solid ${T.am}`,display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ti ti-user-circle" style={{fontSize:26,color:T.am}} aria-hidden="true"/></div>
        <div><div style={{fontSize:"1.2rem",color:T.tx,fontFamily:"Georgia,serif"}}>{name||"Byte"}</div><div style={{fontSize:11,color:T.am,letterSpacing:2}}>{rank.toUpperCase()}</div><div style={{fontSize:11,color:T.mt}}>{L.xpLevel} {xpData.lvl} · {xpData.xp} XP · {streak} {L.streakDays} <i className="ti ti-flame" style={{fontSize:11,color:T.cr}} aria-hidden="true"/></div></div>
      </div>
      <XPBar xpData={xpData} lang={lang} T={T} L={L}/>
      <AIAvatar name={name} rank={rank} T={T} L={L}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:"1.25rem"}}>{[[L.profileScore,`${score}/${maxScore}`],[L.profilePct,`${pct}%`],[L.profileAch,`${unlocked.length}/${ACH_IDS.length}`]].map(([l,v])=>(<div key={l} style={{background:T.bg,borderRadius:6,padding:"0.6rem",textAlign:"center"}}><div style={{fontSize:18,fontWeight:500,color:T.am}}>{v}</div><div style={{fontSize:10,color:T.mt}}>{l}</div></div>))}</div>
      <div style={{marginBottom:"1rem"}}><p style={{fontSize:10,letterSpacing:2,color:T.mt,textTransform:"uppercase",marginBottom:6}}>{L.profileConcepts}</p><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{concepts.map((c,i)=>(<span key={i} style={{fontSize:11,background:T.al,border:`0.5px solid ${T.ab}`,color:T.am,padding:"2px 10px",borderRadius:4}}>{c}</span>))}</div></div>
      <div style={{fontSize:10,color:T.mt,textAlign:"right"}}>{today} · {mode} · {difficulty}</div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      <NBtn onClick={dlCard} T={T}><i className="ti ti-download" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.profileDl}</NBtn>
      <NBtn onClick={()=>shareCard({name,rank,score,maxScore,pct,concepts,lang,T})} T={T}><i className="ti ti-share" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.profileShare}</NBtn>
    </div>
  </div>);}

function dlCheatsheet(learned,L){const lines=[L.cheatTitle,"=".repeat(50),""];learned.forEach(c=>{const nm=L.lang==="en"?(c.nmEn||c.nm):c.nm;const sm=L.lang==="en"?(c.sumEn||c.sum):c.sum;lines.push(`▸ ${nm.toUpperCase()}`);lines.push(sm);lines.push("");lines.push("Python:");lines.push(c.py||"");lines.push("");lines.push("JavaScript:");lines.push(c.js||"");lines.push("-".repeat(50));lines.push("");});const b=new Blob([lines.join("\n")],{type:"text/plain"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="cheatsheet.txt";a.click();}

// ── SANDBOX ───────────────────────────────────────────────────
function Sandbox({scene,language,T,L,onNext,onAchieve}){
  const[code,setCode]=useState(language==="js"?scene.concept.js:scene.concept.py);
  const[out,setOut]=useState("");const[running,setRunning]=useState(false);
  const[skulptReady,setSkulptReady]=useState(!!window.Sk);const[lang,setLang]=useState(language==="js"?"js":"py");
  useEffect(()=>{if(!window.Sk){const s1=document.createElement("script");s1.src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js";s1.onload=()=>{const s2=document.createElement("script");s2.src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js";s2.onload=()=>setSkulptReady(true);document.head.appendChild(s2);};document.head.appendChild(s1);}else setSkulptReady(true);},[]);
  useEffect(()=>{setCode(lang==="js"?scene.concept.js:scene.concept.py);},[lang]);
  const runJS=()=>{let logs=[];const orig=console.log;console.log=(...a)=>{logs.push(a.map(x=>typeof x==="object"?JSON.stringify(x):String(x)).join(" "));orig(...a);};try{new Function(code)();setOut(logs.join("\n")||`(${L.sandboxNoOut} console.log?)`);}catch(e){setOut("Error: "+e.message);}finally{console.log=orig;}};
  const runPY=()=>{if(!window.Sk){setOut(L.skulptLoading);return;}let o="";window.Sk.configure({output:t=>{o+=t;},read:f=>{if(window.Sk.builtinFiles?.files[f])return window.Sk.builtinFiles.files[f];throw f;}});window.Sk.misceval.asyncToPromise(()=>window.Sk.importMainWithBody("<stdin>",false,code,true)).then(()=>setOut(o||`(${L.sandboxNoOut} print?)`)).catch(e=>setOut("Error: "+e.toString())).finally(()=>setRunning(false));};
  const run=()=>{setRunning(true);setOut("");onAchieve("sandbox_a");if(lang==="js"){runJS();setRunning(false);}else runPY();};
  return(<div>
    <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.75rem"}}><i className="ti ti-terminal-2" style={{fontSize:13,marginRight:6,verticalAlign:"-1px"}} aria-hidden="true"/>{L.sandboxTitle}</p>
    <div style={{display:"flex",gap:6,marginBottom:8}}>{[["py","Python"],["js","JavaScript"]].map(([k,l])=>(<button key={k} onClick={()=>setLang(k)} style={{background:lang===k?T.al:"transparent",border:`0.5px solid ${lang===k?T.am:T.ab}`,color:lang===k?T.am:T.mt,padding:"3px 12px",borderRadius:4,cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif"}}>{l}</button>))}</div>
    <textarea value={code} onChange={e=>setCode(e.target.value)} style={{width:"100%",background:T.cb,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.9rem 1.1rem",fontFamily:"Courier New,monospace",fontSize:"0.8rem",color:"#b8dfa0",lineHeight:1.78,resize:"vertical",minHeight:130,boxSizing:"border-box",outline:"none",marginBottom:8}}/>
    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:"0.75rem"}}><button onClick={run} disabled={running||(lang==="py"&&!skulptReady)} style={{background:T.al,border:`0.5px solid ${T.am}`,color:T.am,padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif",display:"flex",alignItems:"center",gap:6}}><i className="ti ti-player-play" style={{fontSize:13}} aria-hidden="true"/>{running?L.sandboxRunning:L.sandboxRun}</button><span style={{fontSize:11,color:T.mt}}>{L.sandboxHint}</span></div>
    {out&&<pre style={{background:T.cb,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.85rem 1.1rem",fontSize:"0.78rem",color:out.startsWith("Error")||out.startsWith("Erro")?T.cr:"#b8dfa0",fontFamily:"Courier New,monospace",lineHeight:1.7,whiteSpace:"pre-wrap",marginBottom:"1rem",maxHeight:160,overflowY:"auto"}}>{out}</pre>}
    <NBtn onClick={onNext} T={T}>{L.sandboxNext}</NBtn>
  </div>);}

// ── GAMEPLAY SCREENS ──────────────────────────────────────────
function Intro({onStart,onDaily,onMulti,settings,setSettings,streak,xpData}){
  const L=UI[settings.lang||"pt"];const T=TH[settings.theme];
  const lang=settings.lang||"pt";
  const dailyIdx=(()=>{const d=new Date().toDateString();let h=0;for(const c of d)h=(h*31+c.charCodeAt(0))%SCENES.length;return h;})();
  const diffOpts=lang==="en"?[["beginner",L.diffInit],["challenging",L.diffHard]]:[["iniciante",L.diffInit],["desafiador",L.diffHard]];
  const xpTitle=lang==="en"?xpData.enTi:xpData.ptTi;
  return(<div style={{paddingTop:"2rem",paddingBottom:"1rem"}}>
    <div style={{textAlign:"center",marginBottom:"1.75rem"}}>
      <i className="ti ti-sword" style={{fontSize:40,color:T.am,display:"block",marginBottom:"0.75rem"}} aria-hidden="true"/>
      <p style={{fontSize:10,letterSpacing:4,color:T.am,textTransform:"uppercase",marginBottom:"0.4rem"}}>{L.subtitle}</p>
      <h1 style={{fontSize:"2rem",fontWeight:"normal",color:T.tx,marginBottom:"0.5rem",letterSpacing:"1.5px",fontFamily:"Georgia,serif"}}>{lang==="en"?"Lands of Code":"Terras do Código"}</h1>
      <p style={{fontSize:"0.85rem",color:T.mt,maxWidth:400,margin:"0 auto 0.5rem",lineHeight:1.85,fontFamily:"Georgia,serif"}}>{L.chapters}</p>
      <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
        <span style={{fontSize:11,color:T.am,background:T.al,border:`0.5px solid ${T.ab}`,padding:"2px 10px",borderRadius:4}}>{L.xpLevel} {xpData.lvl} — {xpTitle}</span>
        <StreakBadge streak={streak} T={T} L={L}/>
      </div>
    </div>
    <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:"1.25rem"}}>
      {[["pt","🇧🇷 Português"],["en","🇺🇸 English"]].map(([v,l])=>(<button key={v} onClick={()=>setSettings(s=>({...s,lang:v}))} style={{background:settings.lang===v?T.al:"transparent",border:`0.5px solid ${settings.lang===v?T.am:T.ab}`,color:settings.lang===v?T.am:T.mt,padding:"5px 16px",borderRadius:20,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}>{l}</button>))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:10,marginBottom:"1.25rem"}}>
      {[[L.settingTheme,"theme",[["dark","Grimório"],["light","Pergaminho"],["cyber","Neon"]]],
        [L.settingDiff,"difficulty",diffOpts],
        [L.settingCode,"language",[["py",L.langPy],["js",L.langJs],["both",L.langBoth]]]].map(([label,key,opts])=>(
        <div key={key} style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"0.9rem"}}>
          <p style={{fontSize:10,letterSpacing:2,color:T.am,textTransform:"uppercase",marginBottom:"0.55rem"}}>{label}</p>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {opts.map(([v,l])=>(<button key={v} onClick={()=>setSettings(s=>({...s,[key]:v}))} style={{background:settings[key]===v?T.al:"transparent",border:`0.5px solid ${settings[key]===v?T.am:T.ab}`,color:settings[key]===v?T.am:T.mt,padding:"4px 9px",borderRadius:4,cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif",textAlign:"left"}}>{settings[key]===v&&"✓ "}{l}</button>))}
          </div>
        </div>))}
    </div>
    <div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"0.9rem",marginBottom:"0.85rem"}}>
      <p style={{fontSize:10,letterSpacing:2,color:T.am,textTransform:"uppercase",marginBottom:"0.55rem"}}>{L.settingPlayer}</p>
      <input value={settings.p1} onChange={e=>setSettings(s=>({...s,p1:e.target.value}))} placeholder="Byte" style={{background:T.cb,border:`0.5px solid ${T.ab}`,color:T.tx,padding:"5px 9px",borderRadius:4,fontSize:13,fontFamily:"Georgia,serif",outline:"none",width:"100%",boxSizing:"border-box",marginBottom:8}}/>
      <p style={{fontSize:10,letterSpacing:2,color:T.am,textTransform:"uppercase",marginBottom:"0.4rem"}}>{L.settingFont}</p>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:11,color:T.mt}}>A</span>
        <input type="range" min="85" max="130" value={Math.round((settings.fontSize||1)*100)} onChange={e=>setSettings(s=>({...s,fontSize:parseInt(e.target.value)/100}))} style={{flex:1}}/>
        <span style={{fontSize:13,color:T.mt}}>A</span>
        <span style={{fontSize:11,color:T.am,minWidth:32}}>{Math.round((settings.fontSize||1)*100)}%</span>
      </div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
      <NBtn onClick={onStart} T={T}>{L.playSolo}</NBtn>
      <NBtn onClick={onMulti} T={T}><i className="ti ti-users" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.playMulti}</NBtn>
      <NBtn onClick={()=>onDaily(dailyIdx)} T={T}><i className="ti ti-calendar" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.playDaily}</NBtn>
    </div>
    <p style={{fontSize:11,color:T.mt,textAlign:"center",marginTop:"0.65rem",fontFamily:"Georgia,serif"}}>{L.dailyToday} {lang==="en"?(SCENES[dailyIdx].titleEn||SCENES[dailyIdx].title||""):SCENES[dailyIdx].title||""}</p>
  </div>);}

function MultiSetup({T,L,settings,setSettings,onStart,onBack}){return(<div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.multiTitle}</p></div><p style={{fontSize:"0.9rem",color:T.tx,marginBottom:"1.5rem",fontFamily:"Georgia,serif",lineHeight:1.7}}>{L.multiDesc}</p>{[[L.player1,"p1"],[L.player2,"p2"]].map(([label,key])=>(<div key={key} style={{marginBottom:"1rem"}}><p style={{fontSize:11,color:T.am,marginBottom:5,fontFamily:"Georgia,serif"}}>{label}</p><input value={settings[key]} onChange={e=>setSettings(s=>({...s,[key]:e.target.value}))} placeholder={label} style={{background:T.sf,border:`0.5px solid ${T.ab}`,color:T.tx,padding:"8px 12px",borderRadius:4,fontSize:13,fontFamily:"Georgia,serif",outline:"none",width:"100%",boxSizing:"border-box"}}/></div>))}<NBtn onClick={onStart} T={T}><i className="ti ti-users" style={{fontSize:12,marginRight:6}} aria-hidden="true"/>{L.startMulti}</NBtn></div>);}

function PlayerSwitch({next,score,T,L,onContinue}){return(<div style={{textAlign:"center",paddingTop:"2rem"}}><i className="ti ti-arrow-left-right" style={{fontSize:40,color:T.am,display:"block",marginBottom:"1rem"}} aria-hidden="true"/><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.5rem"}}>{L.switchTitle}</p><p style={{fontSize:"1.1rem",color:T.tx,marginBottom:"0.5rem",fontFamily:"Georgia,serif"}}>{L.switchScore} {score} {L.pts}</p><p style={{fontSize:"0.9rem",color:T.mt,marginBottom:"2rem",fontFamily:"Georgia,serif"}}>{L.switchPass} <strong style={{color:T.am}}>{next}</strong></p><NBtn onClick={onContinue} T={T}>{L.switchBtn} {next} →</NBtn></div>);}

function Reading({scene,difficulty,lang,hintShown,onHint,onPick,T,L,hintCost,timerSecs,timerMax,isSpeed}){
  const isHard=difficulty==="desafiador"||difficulty==="challenging";
  const narr=isHard?S(scene,"narrH",lang):S(scene,"narr",lang);
  const hint=S(scene,"hint",lang);
  const hintLabel=hintCost>0?`${L.hintBtn} ${L.hintCost.replace("{n}",hintCost)}`:`${L.hintBtn} ${L.hintFree}`;
  const chLabel=lang==="en"?(scene.chEn||scene.ch):scene.ch;
  const title=lang==="en"?(scene.titleEn||scene.title||scene.id):scene.title||scene.id;
  return(<div>
    <div style={{marginBottom:"1.25rem"}}>
      <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.3rem"}}><i className={`ti ${scene.icon}`} style={{fontSize:13,marginRight:6,verticalAlign:"-1px"}} aria-hidden="true"/>{chLabel}</p>
      <h2 style={{fontSize:"1.3rem",fontWeight:"normal",color:T.tx,margin:0,fontFamily:"Georgia,serif"}}>{title}</h2>
    </div>
    {scene.portrait&&<Portrait p={scene.portrait} lang={lang} T={T}/>}
    {isSpeed&&<TimerBar secs={timerSecs} max={timerMax} T={T} L={L}/>}
    <div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"1.4rem 1.5rem",marginBottom:"1.25rem",lineHeight:1.85,fontSize:"0.92rem",whiteSpace:"pre-line",color:T.tx,fontFamily:"Georgia,serif"}}>{narr}</div>
    {!hintShown?(<button onClick={onHint} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:12,fontFamily:"Georgia,serif",marginBottom:"1rem"}}><i className="ti ti-bulb" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{hintLabel}</button>):(<div style={{background:"rgba(239,159,39,0.06)",border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.6rem 0.9rem",marginBottom:"1rem",fontSize:12,color:T.am,fontFamily:"Georgia,serif",lineHeight:1.6}}><i className="ti ti-bulb" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{hint}</div>)}
    <p style={{fontSize:10,letterSpacing:3,color:T.mt,textTransform:"uppercase",marginBottom:"0.65rem"}}>{L.whatDo}</p>
    <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>{scene.choices.map((c,i)=><CBtn key={i} onClick={()=>onPick(i)} T={T}>{SC(c,"text",lang)}</CBtn>)}</div>
  </div>);}

function Chosen({choice,lang,T,L,onContinue}){const g=choice.good;const clr=g?T.gn:T.cr;const cbd=g?"rgba(93,202,165,.22)":"rgba(216,90,48,.22)";const cons=SC(choice,"cons",lang);return(<div><div style={{marginBottom:"1rem"}}><span style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:clr,background:g?"rgba(93,202,165,.07)":"rgba(216,90,48,.07)",border:`0.5px solid ${cbd}`,padding:"3px 10px",borderRadius:4}}><i className={`ti ${g?"ti-check":"ti-alert-triangle"}`} style={{fontSize:12,marginRight:5,verticalAlign:"-1px"}} aria-hidden="true"/>{g?L.goodChoice:L.badChoice}</span></div><div style={{background:T.sf,border:`0.5px solid ${cbd}`,borderLeft:`3px solid ${clr}`,borderRadius:8,padding:"1.4rem 1.5rem",marginBottom:"1.5rem",lineHeight:1.85,fontSize:"0.92rem",whiteSpace:"pre-line",color:T.tx,fontFamily:"Georgia,serif"}}>{cons}</div><NBtn onClick={onContinue} T={T}>{(choice.branch||choice.branchEn)?L.continueBtn:L.conceptBtn}</NBtn></div>);}
function BranchScene({choice,lang,T,L,onContinue}){const branch=SC(choice,"branch",lang);return(<div><div style={{marginBottom:"1rem"}}><span style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:T.am,background:T.al,border:`0.5px solid ${T.ab}`,padding:"3px 10px",borderRadius:4}}><i className="ti ti-rotate" style={{fontSize:12,marginRight:5,verticalAlign:"-1px"}} aria-hidden="true"/>{L.branchTag}</span></div><div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderLeft:`3px solid ${T.am}`,borderRadius:8,padding:"1.4rem 1.5rem",marginBottom:"1.5rem",lineHeight:1.85,fontSize:"0.92rem",whiteSpace:"pre-line",color:T.tx,fontFamily:"Georgia,serif"}}>{branch}</div><NBtn onClick={onContinue} T={T}>{L.conceptBtn}</NBtn></div>);}

function ConceptCard({scene,language,lang,T,L,onNext}){
  const c=scene.concept;
  const[tab,setTab]=useState("code");
  const[codeLang,setCodeLang]=useState(language==="js"?"js":"py");
  const[py,setPy]=useState(c.py);const[js,setJs]=useState(c.js);
  const curCode=codeLang==="py"?py:js;const setCode=codeLang==="py"?setPy:setJs;
  const nm=lang==="en"?(c.nmEn||c.nm):c.nm;const sm=lang==="en"?(c.sumEn||c.sum):c.sum;
  const hasAnim=!!ANIM_STEPS[scene.id];
  return(<div>
    <div style={{border:`0.5px solid ${c.bd}`,background:c.bg,borderRadius:8,padding:"1.5rem",marginBottom:"1.5rem"}}>
      <p style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:c.cl,marginBottom:"0.4rem"}}><i className="ti ti-bulb" style={{fontSize:13,marginRight:6,verticalAlign:"-1px"}} aria-hidden="true"/>{L.conceptLearned}</p>
      <h3 style={{fontSize:"1.2rem",fontWeight:"normal",color:T.tx,marginBottom:"0.85rem",fontFamily:"Georgia,serif"}}>{nm}</h3>
      <p style={{fontSize:"0.88rem",color:T.tx,lineHeight:1.78,marginBottom:"1.25rem",fontFamily:"Georgia,serif"}}>{sm}</p>
      <div style={{display:"flex",gap:6,marginBottom:"0.85rem"}}>
        {[["code",`</> ${L.codeTab}`],["anim",`▶ ${L.animTab}`]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} disabled={k==="anim"&&!hasAnim} style={{background:tab===k?T.al:"transparent",border:`0.5px solid ${tab===k?T.am:T.ab}`,color:tab===k?T.am:T.mt,padding:"3px 12px",borderRadius:4,cursor:k==="anim"&&!hasAnim?"default":"pointer",fontSize:11,fontFamily:"Georgia,serif",opacity:k==="anim"&&!hasAnim?0.4:1}}>{l}</button>
        ))}
      </div>
      {tab==="code"&&<div>
        <div style={{display:"flex",gap:6,marginBottom:8,alignItems:"center"}}>
          {(language==="both"?[["py","Python"],["js","JavaScript"]]:language==="js"?[["js","JavaScript"]]:[["py","Python"]]).map(([k,l])=>(<button key={k} onClick={()=>setCodeLang(k)} style={{background:codeLang===k?T.al:"transparent",border:`0.5px solid ${codeLang===k?T.am:T.ab}`,color:codeLang===k?T.am:T.mt,padding:"3px 12px",borderRadius:4,cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif"}}>{l}</button>))}
          <button onClick={()=>setCode(codeLang==="py"?c.py:c.js)} style={{marginLeft:"auto",background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,padding:"3px 10px",borderRadius:4,cursor:"pointer",fontSize:10,fontFamily:"Georgia,serif"}}><i className="ti ti-refresh" style={{fontSize:10,marginRight:4}} aria-hidden="true"/>{L.resetCode}</button>
        </div>
        <textarea value={curCode} onChange={e=>setCode(e.target.value)} style={{width:"100%",background:T.cb,border:`0.5px solid rgba(239,159,39,.1)`,borderRadius:6,padding:"0.9rem 1.1rem",fontFamily:"Courier New,monospace",fontSize:"0.79rem",color:"#b8dfa0",lineHeight:1.78,resize:"vertical",minHeight:120,boxSizing:"border-box",outline:"none"}}/>
        <p style={{fontSize:11,color:T.mt,marginTop:5,fontFamily:"Georgia,serif"}}><i className="ti ti-pencil" style={{fontSize:10,marginRight:4}} aria-hidden="true"/>{L.editCode}</p>
      </div>}
      {tab==="anim"&&<CodeAnim sceneId={scene.id} lang={lang} T={T} L={L}/>}
    </div>
    <NBtn onClick={onNext} T={T}>{L.conceptNext}</NBtn>
  </div>);}

function Quiz({scene,lang,isLast,T,L,onSubmit}){
  const[sel,setSel]=useState(null);const[rev,setRev]=useState(false);
  const q=lang==="en"?(scene.quiz.qEn||scene.quiz.q):scene.quiz.q;
  const opts=lang==="en"?(scene.quiz.optsEn||scene.quiz.opts):scene.quiz.opts;
  const ok=sel===scene.quiz.ok;
  return(<div>
    <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.5rem"}}><i className="ti ti-help-circle" style={{fontSize:13,marginRight:6,verticalAlign:"-1px"}} aria-hidden="true"/>{L.quizTitle}</p>
    <p style={{fontSize:"0.96rem",color:T.tx,marginBottom:"1.25rem",fontFamily:"Georgia,serif",lineHeight:1.7}}>{q}</p>
    <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",marginBottom:"1rem"}}>{opts.map((opt,i)=>{let bd=T.ab,bg="transparent",tc=T.tx;if(rev){if(i===scene.quiz.ok){bd="rgba(93,202,165,.5)";bg="rgba(93,202,165,.08)";tc=T.gn;}else if(i===sel){bd="rgba(216,90,48,.5)";bg="rgba(216,90,48,.08)";tc=T.cr;}}else if(i===sel){bd=T.am;bg=T.al;}return(<button key={i} onClick={()=>!rev&&setSel(i)} style={{background:bg,border:`0.5px solid ${bd}`,color:tc,padding:"0.75rem 1rem",textAlign:"left",cursor:rev?"default":"pointer",borderRadius:8,fontSize:"0.9rem",fontFamily:"Georgia,serif",lineHeight:1.5,transition:"all 0.2s"}}>{rev&&i===scene.quiz.ok&&<i className="ti ti-check" style={{fontSize:12,marginRight:8,color:T.gn}} aria-hidden="true"/>}{rev&&i===sel&&i!==scene.quiz.ok&&<i className="ti ti-x" style={{fontSize:12,marginRight:8,color:T.cr}} aria-hidden="true"/>}{opt}</button>);})}</div>
    {!rev?(<NBtn onClick={()=>sel!==null&&setRev(true)} disabled={sel===null} T={T}>{L.quizCheck}</NBtn>):(<div><p style={{fontSize:"0.88rem",color:ok?T.gn:T.mt,marginBottom:"1rem",fontFamily:"Georgia,serif"}}>{ok?L.quizRight:L.quizWrong}</p><NBtn onClick={()=>onSubmit(sel)} T={T}>{isLast?L.quizFinal:L.quizNextCh}</NBtn></div>)}
  </div>);}

function Glossary({learned,lang,open,onToggle,T,L}){return(<div style={{borderTop:`0.5px solid ${T.ab}`,marginTop:"1.5rem"}}><button onClick={onToggle} style={{width:"100%",background:"transparent",border:"none",color:T.mt,padding:"0.75rem 0",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontSize:12,fontFamily:"Georgia,serif",letterSpacing:1}}><i className="ti ti-book" style={{fontSize:14,color:T.am}} aria-hidden="true"/>{L.grimoire} ({learned.length} {L.grimoireConcepts})<i className={`ti ${open?"ti-chevron-up":"ti-chevron-down"}`} style={{fontSize:12,marginLeft:"auto"}} aria-hidden="true"/></button>{open&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:8,paddingBottom:"1.5rem"}}>{learned.map((c,i)=>{const nm=lang==="en"?(c.nmEn||c.nm):c.nm;const sm=lang==="en"?(c.sumEn||c.sum):c.sum;return(<div key={i} style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"0.75rem"}}><div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:c.cl,marginBottom:4}}>{nm}</div><div style={{fontSize:12,color:T.mt,lineHeight:1.6}}>{sm}</div></div>);})}{!learned.length&&<p style={{fontSize:13,color:T.mt,fontFamily:"Georgia,serif"}}>{L.grimoireEmpty}</p>}</div>}</div>);}

function End({players,currentP,mode,T,L,lang,learned,errors,onRestart,onProfile,onLB,onChapters,onReview}){
  const p=players[currentP];const other=mode==="multi"?players[1-currentP]:null;
  const maxScore=SCENES.length*15;const pct=Math.round((p.score/maxScore)*100);const ri=pct>=90?0:pct>=70?1:pct>=50?2:3;
  return(<div style={{textAlign:"center",paddingTop:"2rem"}}>
    <i className="ti ti-trophy" style={{fontSize:48,color:T.am,display:"block",marginBottom:"1rem"}} aria-hidden="true"/>
    <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.5rem"}}>{L.endTitle}</p>
    <h2 style={{fontSize:"1.8rem",fontWeight:"normal",color:T.tx,marginBottom:"0.5rem",fontFamily:"Georgia,serif"}}>{L.ranks[ri]}</h2>
    <p style={{fontSize:"0.9rem",color:T.mt,marginBottom:"1.5rem",fontFamily:"Georgia,serif"}}>{p.name||"Byte"} · {p.score} {L.pts} · {pct}%</p>
    {other&&<div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"0.85rem",marginBottom:"1.5rem",fontSize:"0.9rem",color:T.tx,fontFamily:"Georgia,serif"}}><i className="ti ti-users" style={{fontSize:14,marginRight:8,color:T.am}} aria-hidden="true"/>{other.name}: {other.score} {L.pts} {p.score>other.score?L.endMultiWin:p.score<other.score?L.endMultiLose:L.endMultiDraw}</div>}
    <div style={{height:8,background:T.al,borderRadius:99,overflow:"hidden",maxWidth:300,margin:"0 auto 1.5rem"}}><div style={{width:`${pct}%`,height:"100%",background:pct>=70?T.gn:T.am,borderRadius:99}}/></div>
    <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginBottom:"1.75rem"}}>{learned.map((c,i)=>{const nm=lang==="en"?(c.nmEn||c.nm):c.nm;return(<span key={i} style={{background:T.al,border:`0.5px solid ${T.ab}`,color:T.am,padding:"3px 12px",borderRadius:4,fontSize:11}}><i className="ti ti-check" style={{fontSize:10,marginRight:4}} aria-hidden="true"/>{nm}</span>);})}</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:"1rem"}}>
      <NBtn onClick={onProfile} T={T}><i className="ti ti-id-badge" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.endProfile}</NBtn>
      <NBtn onClick={onLB} T={T}><i className="ti ti-trophy" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.endLB}</NBtn>
      <NBtn onClick={()=>dlCheatsheet(learned,L)} T={T}><i className="ti ti-download" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.endCheat}</NBtn>
      {errors.length>0&&<NBtn onClick={onReview} T={T}><i className="ti ti-history" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.endReview} ({errors.length})</NBtn>}
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}><NBtn onClick={onRestart} T={T}>{L.endReplay}</NBtn><NBtn onClick={onChapters} T={T}>{L.endMap}</NBtn></div>
    <p style={{fontSize:12,color:T.mt,marginTop:"1.5rem",fontFamily:"Georgia,serif"}}>{L.endContinue}</p>
  </div>);}

// ══ MAIN APP ══════════════════════════════════════════════════
export default function App(){
  const[settings,setSettings]=useState({theme:"dark",difficulty:"iniciante",language:"py",lang:"pt",p1:"Byte",p2:"Pixel",fontSize:1});
  const T=TH[settings.theme];const L=UI[settings.lang||"pt"];const lang=settings.lang||"pt";
  const audioRef=useRef(null);
  const[phase,setPhase]=useState("intro");
  const[idx,setIdx]=useState(0);
  const[choiceIdx,setChoiceIdx]=useState(null);
  const[players,setPlayers]=useState([{name:"Byte",score:0,achievements:[],inventory:[]},{name:"Pixel",score:0,achievements:[],inventory:[]}]);
  const[currentP,setCurrentP]=useState(0);
  const[mode,setMode]=useState("solo");
  const[learned,setLearned]=useState([]);
  const[errors,setErrors]=useState([]);
  const[glossary,setGlossary]=useState(false);
  const[hintShown,setHintShown]=useState(false);
  const[timerSecs,setTimerSecs]=useState(30);
  const[timerMax]=useState(30);
  const[quizStreak,setQuizStreak]=useState(0);
  const[toastAch,setToastAch]=useState(null);
  const[animKey,setAnimKey]=useState(0);
  const[transitionOut,setTransitionOut]=useState(false);
  const[chapterStart,setChapterStart]=useState(Date.now());
  const[pendingBoss,setPendingBoss]=useState(null);
  const timerRef=useRef(null);
  const isSpeed=mode==="speed";const isMulti=mode==="multi";
  const scene=SCENES[idx];const choice=scene&&choiceIdx!==null?scene.choices[choiceIdx]:null;
  const hintCost=settings.difficulty==="desafiador"||settings.difficulty==="challenging"?2:0;
  const p=players[currentP];
  const maxScore=SCENES.length*15;

  // Persistent XP
  const[globalXP,setGlobalXP]=useState(()=>{try{return parseInt(localStorage.getItem("tdc_xp")||"0");}catch{return 0;}});
  const xpData=getLevel(globalXP);
  const addXP=useCallback((n)=>setGlobalXP(prev=>{const nv=prev+n;try{localStorage.setItem("tdc_xp",String(nv));}catch{}return nv;}),[]);

  // Streak
  const[streak,setStreak]=useState(()=>{try{const d=localStorage.getItem("tdc_streak_date");const s=parseInt(localStorage.getItem("tdc_streak")||"0");if(!d)return 0;const last=new Date(d);const now=new Date();const diff=Math.floor((now-last)/(1000*60*60*24));if(diff===0)return s;if(diff===1){const ns=s+1;localStorage.setItem("tdc_streak",String(ns));localStorage.setItem("tdc_streak_date",now.toDateString());return ns;}localStorage.setItem("tdc_streak","1");localStorage.setItem("tdc_streak_date",now.toDateString());return 1;}catch{return 0;}});

  useEffect(()=>{
    try{
      const sv=JSON.parse(localStorage.getItem("tdc_save")||"null");
      if(sv&&sv.phase!=="intro"&&sv.phase!=="end"){setPhase(sv.phase);setIdx(sv.idx||0);setLearned(sv.learned||[]);setPlayers(sv.players||players);setSettings(s=>({...s,...(sv.settings||{}),...{lang:s.lang}}));}
    }catch{}
    audioRef.current=mkAudio();
    if(!localStorage.getItem("tdc_streak_date")){try{localStorage.setItem("tdc_streak","1");localStorage.setItem("tdc_streak_date",new Date().toDateString());}catch{}}
  },[]);

  useEffect(()=>{if(phase!=="intro")try{localStorage.setItem("tdc_save",JSON.stringify({phase,idx,learned,players,settings}));}catch{};},[phase,idx,learned]);
  useEffect(()=>{if(xpData.lvl>=10)achieve("lvl10");},[globalXP]);

  useEffect(()=>{
    if(isSpeed&&phase==="reading"){setTimerSecs(timerMax);timerRef.current=setInterval(()=>{setTimerSecs(s=>{if(s<=1){clearInterval(timerRef.current);audioRef.current?.err();pick(Math.floor(Math.random()*scene.choices.length));return 0;}if(s<=10)audioRef.current?.tick();return s-1;});},1000);}
    return()=>clearInterval(timerRef.current);
  },[phase,idx,isSpeed]);

  const go=(ph,ni)=>{
    setTransitionOut(true);
    setTimeout(()=>{if(ni!==undefined)setIdx(ni);setPhase(ph);setAnimKey(k=>k+1);setTransitionOut(false);},240);
  };

  const achieve=(id)=>{
    setPlayers(prev=>{const ps=[...prev];if(!ps[currentP].achievements.includes(id)){ps[currentP]={...ps[currentP],achievements:[...ps[currentP].achievements,id]};const i=ACH_IDS.indexOf(id);if(i>=0){const a=L.ach[i];if(a)setToastAch({...a,icon:ACH_ICONS[i]});}}return ps;});
  };
  const addScore=(n)=>setPlayers(prev=>{const ps=[...prev];ps[currentP]={...ps[currentP],score:ps[currentP].score+n};return ps;});
  const saveToLB=(score,name)=>{try{const lb=JSON.parse(localStorage.getItem("tdc_lb")||"[]");lb.push({name:name||"Byte",score,mode,difficulty:settings.difficulty,date:Date.now()});lb.sort((a,b)=>b.score-a.score);localStorage.setItem("tdc_lb",JSON.stringify(lb.slice(0,20)));}catch{}};
  const initPlayers=()=>[{name:settings.p1||"Byte",score:0,achievements:[],inventory:[]},{name:settings.p2||"Pixel",score:0,achievements:[],inventory:[]}];

  const startGame=(m,di)=>{setPlayers(initPlayers());setMode(m);setCurrentP(0);setIdx(di||0);setLearned([]);setErrors([]);setHintShown(false);setGlossary(false);setChapterStart(Date.now());setPendingBoss(null);go("reading",di||0);};
  const start=()=>startGame("solo",0);
  const startMulti=()=>{setPlayers(initPlayers());setMode("multi");setCurrentP(0);setIdx(0);setLearned([]);setErrors([]);setHintShown(false);setChapterStart(Date.now());setPendingBoss(null);go("reading",0);achieve("multi");};
  const startDaily=(di)=>startGame("daily",di);

  const pick=(i)=>{
    clearInterval(timerRef.current);setChoiceIdx(i);
    const good=SCENES[idx].choices[i].good;
    if(good){addScore(10);addXP(15);audioRef.current?.ok();if(players[currentP].score===0)achieve("first_good");}else audioRef.current?.err();
    if(!hintShown)achieve("no_hints");
    if((Date.now()-chapterStart)/1000<25)achieve("speed");
    go("chosen");
  };

  const afterChosen=()=>{if(choice?.branch||choice?.branchEn)go("branch");else go("concept");};

  const submitQuiz=(ans,wrongAns)=>{
    const correct=ans===scene.quiz.ok;
    if(correct){addScore(5);addXP(8);audioRef.current?.ok();const ns=quizStreak+1;setQuizStreak(ns);if(ns>=3)achieve("streak3");}else{setQuizStreak(0);}
    if(settings.language==="both")achieve("polyglot");
    const newInv=p.inventory.find(s=>s.id===scene.id)?p.inventory:[...p.inventory,scene];
    setPlayers(prev=>{const ps=[...prev];ps[currentP]={...ps[currentP],inventory:newInv};return ps;});
    if(newInv.length>=6)achieve("collector");
    const newLearned=learned.find(l=>l.nm===scene.concept.nm)?learned:[...learned,{...scene.concept}];
    setLearned(newLearned);
    // Check for boss after this chapter
    const boss=BOSSES.find(b=>b.afterIdx===idx);
    const ni=idx+1;
    const isLast=(mode==="daily")||(ni>=SCENES.length);
    const finish=()=>{
      if(players[currentP].score>=SCENES.length*10)achieve("flawless");
      if(mode==="daily")achieve("daily");
      achieve("all_chapters");
      saveToLB(players[currentP].score,players[currentP].name);
      audioRef.current?.win();
      if(mode==="multi"&&currentP===0){setCurrentP(1);setIdx(0);setHintShown(false);setChapterStart(Date.now());go("playerswitch");}
      else go("end");
    };
    if(boss&&!isLast){
      setPendingBoss({boss,nextIdx:ni});setChoiceIdx(null);setHintShown(false);go("boss");
    } else if(isLast){finish();}
    else{setChoiceIdx(null);setHintShown(false);setChapterStart(Date.now());go("reading",ni);}
  };

  const afterBug=()=>{go("sandbox");};
  const showHeader=!["intro","multi-setup","end","profile","leaderboard","achievements","map","playerswitch","review"].includes(phase);
  const fs=settings.fontSize||1;

  return(<div style={{padding:"0.75rem 0",fontSize:`${fs}rem`}}>
    <style>{`
      @keyframes sceneIn{from{opacity:0;transform:translateY(8px) scale(0.99)}to{opacity:1;transform:translateY(0) scale(1)}}
      @keyframes sceneOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(0.98)}}
      .scene-in{animation:sceneIn 0.32s cubic-bezier(.22,.68,0,1.2) both}
      .scene-out{animation:sceneOut 0.2s ease forwards}
    `}</style>
    {toastAch&&<AchToast ach={toastAch} T={T} onClose={()=>setToastAch(null)}/>}
    <div style={{background:T.bg,borderRadius:12,border:`0.5px solid ${T.ab}`,overflow:"hidden",minHeight:480}}>
      {showHeader&&<div style={{padding:"1.75rem 2rem 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"0.75rem",flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:T.am}}><i className="ti ti-star" style={{fontSize:12,marginRight:4}} aria-hidden="true"/>{p.score} {L.pts}</span>
          {isMulti&&<span style={{fontSize:11,color:T.mt}}>· {p.name}</span>}
          <span style={{fontSize:10,background:T.al,border:`0.5px solid ${T.ab}`,color:T.am,padding:"2px 7px",borderRadius:4}}>{settings.difficulty}</span>
          <StreakBadge streak={streak} T={T} L={L}/>
          <div style={{marginLeft:"auto",display:"flex",gap:5}}>
            {[["ti-map","map"],["ti-award","achievements"],["ti-trophy","leaderboard"]].map(([ic,ph])=>(<button key={ph} onClick={()=>go(ph)} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,width:26,height:26,borderRadius:4,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className={`ti ${ic}`} style={{fontSize:13}} aria-hidden="true"/></button>))}
            <button onClick={()=>{if(window.confirm(lang==="en"?"Restart the game? Your current progress will be lost.":"Reiniciar o jogo? O progresso atual será perdido.")){try{localStorage.removeItem("tdc_save");}catch{}setPhase("intro");setIdx(0);setLearned([]);setErrors([]);setChoiceIdx(null);setPlayers(initPlayers());setCurrentP(0);setHintShown(false);setGlossary(false);setPendingBoss(null);setAnimKey(k=>k+1);}}} title={lang==="en"?"Restart":"Reiniciar"} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,width:26,height:26,borderRadius:4,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ti ti-refresh" style={{fontSize:13}} aria-hidden="true"/></button>
          </div>
        </div>
        <XPBar xpData={xpData} lang={lang} T={T} L={L}/>
        <ProgBar idx={mode==="daily"?0:idx} total={mode==="daily"?1:SCENES.length} T={T}/>
        {p.inventory.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:"0.6rem"}}>{p.inventory.map((s,i)=>{const nm=lang==="en"?(s.item.nameEn||s.item.name):s.item.name;return(<span key={i} title={nm} style={{fontSize:10,color:T.mt,background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:4,padding:"2px 7px",display:"flex",alignItems:"center",gap:3}}><i className={`ti ${s.item.icon}`} style={{fontSize:11,color:T.am}} aria-hidden="true"/>{nm}</span>);})}</div>}
      </div>}
      <div key={animKey} className={transitionOut?"scene-out":"scene-in"} style={{padding:showHeader?"0 2rem 2rem":"2rem 2rem 2rem"}}>
        {phase==="intro"&&<Intro onStart={start} onDaily={startDaily} onMulti={()=>go("multi-setup")} settings={settings} setSettings={setSettings} streak={streak} xpData={xpData}/>}
        {phase==="multi-setup"&&<MultiSetup T={T} L={L} settings={settings} setSettings={setSettings} onStart={startMulti} onBack={()=>go("intro")}/>}
        {phase==="playerswitch"&&<PlayerSwitch next={players[1].name} score={players[0].score} T={T} L={L} onContinue={()=>{setHintShown(false);setChapterStart(Date.now());go("reading",0);}}/>}
        {phase==="reading"&&scene&&<Reading scene={scene} difficulty={settings.difficulty} lang={lang} hintShown={hintShown} onHint={()=>{if(hintCost>0)addScore(-hintCost);setHintShown(true);}} onPick={pick} T={T} L={L} hintCost={hintCost} timerSecs={timerSecs} timerMax={timerMax} isSpeed={isSpeed}/>}
        {phase==="chosen"&&choice&&<Chosen choice={choice} lang={lang} T={T} L={L} onContinue={afterChosen}/>}
        {phase==="branch"&&choice&&<BranchScene choice={choice} lang={lang} T={T} L={L} onContinue={()=>go("concept")}/>}
        {phase==="concept"&&scene&&<ConceptCard scene={scene} language={settings.language} lang={lang} T={T} L={L} onNext={()=>go("fixbug")}/>}
        {phase==="fixbug"&&scene&&<FixBug scene={scene} T={T} L={L} onNext={afterBug} addScore={addScore} onAchieve={achieve}/>}
        {phase==="sandbox"&&scene&&<Sandbox scene={scene} language={settings.language} T={T} L={L} onNext={()=>go("quiz")} onAchieve={achieve}/>}
        {phase==="quiz"&&scene&&<Quiz scene={scene} lang={lang} isLast={mode==="daily"||(idx===SCENES.length-1)} T={T} L={L} onSubmit={(ans)=>{if(ans!==scene.quiz.ok)setErrors(e=>[...e,{...scene,chosen:ans}]);submitQuiz(ans);}}/>}
        {phase==="boss"&&pendingBoss&&<BossChallenge boss={pendingBoss.boss} lang={lang} T={T} L={L} addXP={addXP} onDone={(pts)=>{addScore(pts);achieve("boss_slayer");audioRef.current?.ok();setChoiceIdx(null);setHintShown(false);setChapterStart(Date.now());go("reading",pendingBoss.nextIdx);setPendingBoss(null);}}/>}
        {phase==="map"&&<MapScreen scenes={SCENES} inventory={p.inventory} onJump={i=>{setChoiceIdx(null);setHintShown(false);setChapterStart(Date.now());go("reading",i);}} onBack={()=>go(learned.length>0?"reading":"intro")} T={T} L={L}/>}
        {phase==="achievements"&&<AchScreen unlocked={p.achievements} T={T} L={L} onBack={()=>go(learned.length>0?"reading":"intro")}/>}
        {phase==="leaderboard"&&<LeaderBoard playerName={p.name} T={T} L={L} onBack={()=>go(idx>=0?"reading":"end")}/>}
        {phase==="profile"&&<ProfileScreen name={p.name} score={p.score} maxScore={maxScore} learned={learned} unlocked={p.achievements} inventory={p.inventory} difficulty={settings.difficulty} mode={mode} xpData={xpData} streak={streak} T={T} L={L} lang={lang} onBack={()=>go("end")}/>}
        {phase==="review"&&<ReviewErrors errors={errors} lang={lang} T={T} L={L} onClose={()=>go("end")}/>}
        {phase==="end"&&<End players={players} currentP={currentP} mode={mode} T={T} L={L} lang={lang} learned={learned} errors={errors} onRestart={()=>{try{localStorage.removeItem("tdc_save");}catch{}setPhase("intro");setIdx(0);setLearned([]);setErrors([]);setPlayers(initPlayers());setCurrentP(0);setAnimKey(k=>k+1);}} onProfile={()=>go("profile")} onLB={()=>go("leaderboard")} onChapters={()=>go("map")} onReview={()=>go("review")}/>}
      </div>
      {showHeader&&<div style={{padding:"0 2rem"}}><Glossary learned={learned.map(c=>({nm:c.nm,nmEn:c.nmEn,cl:c.cl,sum:c.sum,sumEn:c.sumEn}))} lang={lang} open={glossary} onToggle={()=>setGlossary(g=>!g)} T={T} L={L}/></div>}
    </div>
  </div>);}
