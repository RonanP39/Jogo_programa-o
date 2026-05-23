import React, { useState, useEffect, useRef, useCallback } from "react";

class ErrorBoundary extends React.Component {
  constructor(props){super(props);this.state={error:null};}
  static getDerivedStateFromError(e){return{error:e};}
  render(){
    if(this.state.error){
      return(<div style={{padding:"2rem",fontFamily:"monospace",color:"#E24B4A",background:"#1a1810",minHeight:"100vh"}}>
        <h2 style={{color:"#EF9F27"}}>Erro detectado</h2>
        <pre style={{whiteSpace:"pre-wrap",fontSize:12,color:"#f4a0a0"}}>{this.state.error.toString()}</pre>
        <pre style={{whiteSpace:"pre-wrap",fontSize:11,color:"rgba(224,212,180,.5)"}}>{this.state.error.stack}</pre>
        <button onClick={()=>this.setState({error:null})} style={{marginTop:"1rem",background:"transparent",border:"1px solid #EF9F27",color:"#EF9F27",padding:"8px 16px",cursor:"pointer",borderRadius:6}}>Tentar de novo</button>
      </div>);
    }
    return this.props.children;
  }
}


const TH={
  dark:{bg:"#1a1810",sf:"#22201a",cb:"#0e0b07",am:"#EF9F27",al:"rgba(239,159,39,.1)",ab:"rgba(239,159,39,.22)",tx:"#e0d4b4",mt:"rgba(224,212,180,.45)",gn:"#5DCAA5",cr:"#D85A30"},
  light:{bg:"#f0e8d0",sf:"#fdf7e8",cb:"#e2dcc8",am:"#7B4800",al:"rgba(123,72,0,.1)",ab:"rgba(123,72,0,.28)",tx:"#1a1004",mt:"rgba(26,16,4,.45)",gn:"#1A6B4A",cr:"#8B2000"},
  cyber:{bg:"#04040e",sf:"#080820",cb:"#020209",am:"#00ffe0",al:"rgba(0,255,224,.07)",ab:"rgba(0,255,224,.22)",tx:"#c0f4ff",mt:"rgba(192,244,255,.38)",gn:"#00ff88",cr:"#ff2d78"},
};

const XP_LEVELS=[
  {xp:0,lvl:1,ptTi:"Estagiário",enTi:"Intern"},{xp:60,lvl:2,ptTi:"Aprendiz",enTi:"Apprentice"},
  {xp:160,lvl:3,ptTi:"Calouro",enTi:"Newcomer"},{xp:320,lvl:4,ptTi:"Iniciante",enTi:"Beginner"},
  {xp:540,lvl:5,ptTi:"Dev Auxiliar",enTi:"Aux Dev"},{xp:820,lvl:6,ptTi:"Programador",enTi:"Programmer"},
  {xp:1160,lvl:7,ptTi:"Dev Júnior",enTi:"Junior Dev"},{xp:1560,lvl:8,ptTi:"Desenvolvedor",enTi:"Developer"},
  {xp:2020,lvl:9,ptTi:"Dev Pleno",enTi:"Mid Dev"},{xp:2540,lvl:10,ptTi:"Eng. Júnior",enTi:"Junior Eng."},
  {xp:3120,lvl:11,ptTi:"Eng. Pleno",enTi:"Mid Eng."},{xp:3760,lvl:12,ptTi:"Eng. Sênior",enTi:"Senior Eng."},
  {xp:4460,lvl:13,ptTi:"Tech Lead",enTi:"Tech Lead"},{xp:5220,lvl:14,ptTi:"Arquiteto",enTi:"Architect"},
  {xp:6040,lvl:15,ptTi:"Dev Sênior",enTi:"Senior Dev"},{xp:6920,lvl:16,ptTi:"Especialista",enTi:"Specialist"},
  {xp:7860,lvl:17,ptTi:"Mestre",enTi:"Master"},{xp:8860,lvl:18,ptTi:"Grão-Mestre",enTi:"Grand Master"},
  {xp:9920,lvl:19,ptTi:"Lendário",enTi:"Legendary"},{xp:11040,lvl:20,ptTi:"Arquimago do Código",enTi:"Code Archmage"},
];

function getLevel(xp){let cur=XP_LEVELS[0];for(const l of XP_LEVELS){if(xp>=l.xp)cur=l;else break;}const idx=XP_LEVELS.indexOf(cur);const next=XP_LEVELS[idx+1];const pct=next?Math.round(((xp-cur.xp)/(next.xp-cur.xp))*100):100;return{...cur,next,pct,xp};}

const CAREER_PATHS={
  all:{ptLabel:"Todos os capítulos",enLabel:"All chapters",icon:"ti-books",
       indices:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]},
  frontend:{ptLabel:"Frontend",enLabel:"Frontend",icon:"ti-palette",
            indices:[0,1,2,3,4,5,7,12,14,17,18]},
  backend:{ptLabel:"Backend",enLabel:"Backend",icon:"ti-server",
           indices:[0,1,2,3,5,6,11,12,13,18,19,20]},
  data:{ptLabel:"Data Science",enLabel:"Data Science",icon:"ti-chart-dots",
        indices:[0,1,2,3,4,5,9,10,15,16,19,21]},
};

const BONUS_QUIZ={
  taverna:[{q:"Como reatribuir uma variável?",qEn:"How to reassign a variable?",opts:["var x = novo","x = novo","new x"],optsEn:["var x = new","x = new","new x"],ok:1},{q:"Qual cria uma variável em Python?",qEn:"Which creates a variable in Python?",opts:["var x=1","x=1","let x=1"],optsEn:["var x=1","x=1","let x=1"],ok:1}],
  encruzilhada:[{q:"elif serve para:",qEn:"elif is used for:",opts:["Fechar o if","Condição extra entre if e else","Loop"],optsEn:["Close the if","Extra condition between if and else","Loop"],ok:1},{q:"if False: funciona?",qEn:"Does if False: work?",opts:["Sim, executa","Sim, não executa","Erro"],optsEn:["Yes, runs","Yes, doesn't run","Error"],ok:1}],
  torre:[{q:"while True: é:",qEn:"while True: is:",opts:["Erro","Loop finito","Loop infinito"],optsEn:["Error","Finite loop","Infinite loop"],ok:2},{q:"Como parar um loop antes do fim?",qEn:"How to stop a loop early?",opts:["stop","break","exit"],optsEn:["stop","break","exit"],ok:1}],
  oficina:[{q:"Parâmetro vs argumento:",qEn:"Parameter vs argument:",opts:["São iguais","Parâmetro na def, argumento na chamada","Argumento na def"],optsEn:["Same thing","Parameter in def, argument in call","Argument in def"],ok:1},{q:"Uma função sem return retorna:",qEn:"A function without return returns:",opts:["0","None/undefined","Erro"],optsEn:["0","None/undefined","Error"],ok:1}],
  mercado:[{q:"frutas[-1] em Python retorna:",qEn:"frutas[-1] in Python returns:",opts:["Erro","Primeiro elemento","Último elemento"],optsEn:["Error","First element","Last element"],ok:2},{q:"Como verificar se item está na lista?",qEn:"How to check if item is in list?",opts:["list.has(x)","x in list","list.contains(x)"],optsEn:["list.has(x)","x in list","list.contains(x)"],ok:1}],
  castelo:[{q:"Qual é válido para acessar objeto?",qEn:"Which is valid to access an object?",opts:["obj->nome","obj::nome","obj.nome"],optsEn:["obj->nome","obj::nome","obj.nome"],ok:2},{q:"Como verificar se chave existe?",qEn:"How to check if key exists?",opts:['"nome" in obj',"obj.has(nome)","check(obj,nome)"],optsEn:['"nome" in obj',"obj.has(nome)","check(obj,nome)"],ok:0}],
  oraculo:[{q:"SyntaxError ocorre quando:",qEn:"SyntaxError occurs when:",opts:["Variável não existe","Código malformado","Tipo errado"],optsEn:["Variable doesn't exist","Code is malformed","Wrong type"],ok:1},{q:"Melhor forma de debugar:",qEn:"Best way to debug:",opts:["Apagar tudo","Ler a mensagem de erro","Reiniciar o computador"],optsEn:["Delete everything","Read the error message","Restart the computer"],ok:1}],
  biblioteca:[{q:"'hello'.replace('l','r') retorna:",qEn:"'hello'.replace('l','r') returns:",opts:["herro","helo","'helo'"],optsEn:["herro","helo","hello"],ok:0},{q:"Como verificar se string começa com 'A'?",qEn:"How to check if string starts with 'A'?",opts:["s[0]=='A'","s.startswith('A')","Ambas"],optsEn:["s[0]=='A'","s.startswith('A')","Both"],ok:2}],
  portal:[{q:"not True retorna:",qEn:"not True returns:",opts:["True","False","None"],optsEn:["True","False","None"],ok:1},{q:"True + True em Python:",qEn:"True + True in Python:",opts:["Erro","True","2"],optsEn:["Error","True","2"],ok:2}],
  museu:[{q:"type('42') é:",qEn:"type('42') is:",opts:["int","str","float"],optsEn:["int","str","float"],ok:1},{q:"Como converter 3.7 para int?",qEn:"How to convert 3.7 to int?",opts:["int(3.7)","str(3.7)","float(3.7)"],optsEn:["int(3.7)","str(3.7)","float(3.7)"],ok:0}],
  espelho:[{q:"Stack overflow é causado por:",qEn:"Stack overflow is caused by:",opts:["Muita memória","Recursão sem caso base","Loop infinito"],optsEn:["Too much memory","Recursion without base case","Infinite loop"],ok:1},{q:"Fibonacci recursivo: fib(5) chama:",qEn:"Recursive Fibonacci: fib(5) calls:",opts:["fib(4) apenas","fib(4) e fib(3)","fib(3) apenas"],optsEn:["fib(4) only","fib(4) and fib(3)","fib(3) only"],ok:1}],
  camara:[{q:"Para que serve 'finally'?",qEn:"What is 'finally' used for?",opts:["Cancelar erro","Sempre executar","Só se der erro"],optsEn:["Cancel error","Always run","Only if error"],ok:1},{q:"raise serve para:",qEn:"raise is used to:",opts:["Capturar erros","Lançar exceção","Ignorar erro"],optsEn:["Catch errors","Raise exception","Ignore error"],ok:1}],
  academia:[{q:"Herança em Python:",qEn:"Inheritance in Python:",opts:["class B(A):","class B extends A:","B inherits A:"],optsEn:["class B(A):","class B extends A:","B inherits A:"],ok:0},{q:"self representa:",qEn:"self represents:",opts:["A classe","A instância atual","O método"],optsEn:["The class","The current instance","The method"],ok:1}],
  mensageiro:[{q:"Promise.all([p1,p2]) faz:",qEn:"Promise.all([p1,p2]) does:",opts:["Executa em sequência","Executa em paralelo","Cancela se uma falhar"],optsEn:["Runs sequentially","Runs in parallel","Cancels if one fails"],ok:1},{q:"async function sempre retorna:",qEn:"async function always returns:",opts:["undefined","Promise","await"],optsEn:["undefined","Promise","await"],ok:1}],
  feiticeiro:[{q:"\\d em regex corresponde a:",qEn:"\\d in regex matches:",opts:["Letra","Dígito","Espaço"],optsEn:["Letter","Digit","Space"],ok:1},{q:"re.sub() serve para:",qEn:"re.sub() is used to:",opts:["Buscar","Substituir","Dividir"],optsEn:["Search","Replace","Split"],ok:1}],
  biblioteca2:[{q:"Merge Sort tem complexidade:",qEn:"Merge Sort has complexity:",opts:["O(n²)","O(n log n)","O(n)"],optsEn:["O(n²)","O(n log n)","O(n)"],ok:1},{q:"Qual algoritmo é estável?",qEn:"Which algorithm is stable?",opts:["Quick Sort","Merge Sort","Heap Sort"],optsEn:["Quick Sort","Merge Sort","Heap Sort"],ok:1}],
  oraculo2:[{q:"O(1) significa:",qEn:"O(1) means:",opts:["Linear","Constante","Quadrático"],optsEn:["Linear","Constant","Quadratic"],ok:1},{q:"Busca binária requer lista:",qEn:"Binary search requires a:",opts:["Desordenada","Ordenada","Vazia"],optsEn:["Unsorted","Sorted","Empty"],ok:1}],
  git:[{q:"git pull faz:",qEn:"git pull does:",opts:["Envia commits","Baixa e mescla mudanças","Cria branch"],optsEn:["Send commits","Download and merge changes","Create branch"],ok:1},{q:"HEAD aponta para:",qEn:"HEAD points to:",opts:["Origem","Commit atual","Último push"],optsEn:["Origin","Current commit","Last push"],ok:1}],
  api:[{q:"Status 404 significa:",qEn:"Status 404 means:",opts:["Erro do servidor","Não encontrado","Sem autorização"],optsEn:["Server error","Not found","Unauthorized"],ok:1},{q:"PUT vs POST:",qEn:"PUT vs POST:",opts:["Iguais","PUT atualiza, POST cria","POST atualiza, PUT cria"],optsEn:["Same","PUT updates, POST creates","POST updates, PUT creates"],ok:1}],
  sql:[{q:"WHERE filtra:",qEn:"WHERE filters:",opts:["Colunas","Linhas","Tabelas"],optsEn:["Columns","Rows","Tables"],ok:1},{q:"JOIN une tabelas por:",qEn:"JOIN merges tables by:",opts:["Nome","Chave relacionada","Posição"],optsEn:["Name","Related key","Position"],ok:1}],
  testes:[{q:"TDD significa:",qEn:"TDD stands for:",opts:["Test Driven Design","Test Driven Development","Testing Debug Done"],optsEn:["Test Driven Design","Test Driven Development","Testing Debug Done"],ok:1},{q:"Mock é usado para:",qEn:"Mocks are used to:",opts:["Simular dependências","Acelerar o código","Formatar dados"],optsEn:["Simulate dependencies","Speed up code","Format data"],ok:0}],
  estruturas:[{q:"Pilha segue qual ordem?",qEn:"Stack follows what order?",opts:["FIFO","LIFO","Random"],optsEn:["FIFO","LIFO","Random"],ok:1},{q:"Árvore binária de busca:",qEn:"Binary search tree:",opts:["Filhos aleatórios","Esq < raiz < Dir","Dir < raiz < Esq"],optsEn:["Random children","Left < root < Right","Right < root < Left"],ok:1}],
};

const BOSSES=[
  {id:"boss1",afterIdx:4,icon:"ti-shield-bolt",ptTitle:"Mini-boss: A Guarda da Torre",enTitle:"Mini-boss: The Tower Guard",
   ptIntro:"Você chegou ao topo dos primeiros 5 capítulos! A Guarda da Torre bloqueia a passagem.",
   enIntro:"You've reached the top of the first 5 chapters! The Tower Guard blocks the way.",xpBonus:40,
   questions:[{q:"O que uma variável armazena?",qEn:"What does a variable store?",opts:["Um único valor nomeado","Lista de funções","Arquivo no disco"],optsEn:["A single named value","A list of functions","A file on disk"],ok:0},{q:"Qual estrutura testa condição?",qEn:"Which tests a condition?",opts:["for loop","if/else","função"],optsEn:["for loop","if/else","function"],ok:1},{q:"range(3) gera:",qEn:"range(3) generates:",opts:["1,2,3","0,1,2","0,1,2,3"],optsEn:["1,2,3","0,1,2","0,1,2,3"],ok:1}]},
  {id:"boss2",afterIdx:9,icon:"ti-dragon",ptTitle:"Mini-boss: O Dragão do Castelo",enTitle:"Mini-boss: The Castle Dragon",
   ptIntro:"O Dragão do Castelo acorda! Prove seu domínio sobre os capítulos 6-10.",
   enIntro:"The Castle Dragon awakens! Prove your mastery of chapters 6-10.",xpBonus:55,
   questions:[{q:"Como acessar 'nome' de objeto?",qEn:"How to access 'name' from object?",opts:["objeto[0]","objeto.nome","objeto->nome"],optsEn:["obj[0]","obj.name","obj->name"],ok:1},{q:"NameError indica:",qEn:"NameError indicates:",opts:["Erro de memória","Variável sem definição","Divisão por zero"],optsEn:["Memory error","Undefined variable","Division by zero"],ok:1},{q:".upper() faz:",qEn:".upper() does:",opts:["Reverte","Maiúsculas","Remove espaços"],optsEn:["Reverses","Uppercase","Removes spaces"],ok:1}]},
  {id:"boss3",afterIdx:16,icon:"ti-flame",ptTitle:"Mini-boss: O Oráculo Corrompido",enTitle:"Mini-boss: The Corrupted Oracle",
   ptIntro:"O Oráculo Corrompido desafia seu conhecimento avançado! Derrote-o para os capítulos finais.",
   enIntro:"The Corrupted Oracle challenges your advanced knowledge!",xpBonus:70,
   questions:[{q:"Caso base na recursão:",qEn:"Base case in recursion:",opts:["Maior valor","Para a chamada","Retorno padrão"],optsEn:["Largest value","Stops the call","Default return"],ok:1},{q:"'finally' executa:",qEn:"'finally' runs:",opts:["Só se erro","Sempre","Só sem erro"],optsEn:["Only if error","Always","Only if no error"],ok:1},{q:"await serve para:",qEn:"await is used to:",opts:["Cancelar","Esperar sem bloquear","Repetir"],optsEn:["Cancel","Wait without blocking","Repeat"],ok:1}]},
];

const BUGS=[
  {id:"taverna",ptTitle:"Bug das Variáveis",enTitle:"Variables Bug",broken:`nome = Byte\nnivel = 1\nprint(nome)\nprint(nivel)`,fixed:`nome = "Byte"\nnivel = 1\nprint(nome)\nprint(nivel)`,expected:"Byte\n1",ptHint:"Strings precisam de aspas.",enHint:"Strings need quotes."},
  {id:"encruzilhada",ptTitle:"Bug das Condicionais",enTitle:"Conditionals Bug",broken:`vida = 80\nif vida = 100:\n    print("cheio")\nelse:\n    print("ferido")`,fixed:`vida = 80\nif vida == 100:\n    print("cheio")\nelse:\n    print("ferido")`,expected:"ferido",ptHint:"Comparação usa ==, não =.",enHint:"Comparison uses ==, not =."},
  {id:"torre",ptTitle:"Bug dos Loops",enTitle:"Loops Bug",broken:`total = 0\nfor i in range(5)\n    total += i\nprint(total)`,fixed:`total = 0\nfor i in range(5):\n    total += i\nprint(total)`,expected:"10",ptHint:"'for' precisa de ':' no final.",enHint:"'for' needs ':' at the end."},
  {id:"oficina",ptTitle:"Bug das Funções",enTitle:"Functions Bug",broken:`def dobrar(n):\n    resultado = n * 2\n\nprint(dobrar(5))`,fixed:`def dobrar(n):\n    resultado = n * 2\n    return resultado\n\nprint(dobrar(5))`,expected:"10",ptHint:"Falta o return.",enHint:"Missing return."},
  {id:"mercado",ptTitle:"Bug dos Arrays",enTitle:"Arrays Bug",broken:`frutas = ["maçã","banana","laranja"]\nprint(frutas[3])`,fixed:`frutas = ["maçã","banana","laranja"]\nprint(frutas[2])`,expected:"laranja",ptHint:"Índices começam em 0.",enHint:"Indices start at 0."},
  {id:"castelo",ptTitle:"Bug dos Objetos",enTitle:"Objects Bug",broken:`heroi = {"nome": "Byte", "nivel": 5}\nprint(heroi["name"])`,fixed:`heroi = {"nome": "Byte", "nivel": 5}\nprint(heroi["nome"])`,expected:"Byte",ptHint:"A chave é 'nome', não 'name'.",enHint:"The key is 'nome', not 'name'."},
  {id:"oraculo",ptTitle:"Bug do Debug",enTitle:"Debugging Bug",broken:`msg = "Olá mundo"\nprint(msg.uper())`,fixed:`msg = "Olá mundo"\nprint(msg.upper())`,expected:"OLÁ MUNDO",ptHint:"Erro de digitação: 'uper' → 'upper'.",enHint:"Typo: 'uper' → 'upper'."},
  {id:"biblioteca",ptTitle:"Bug das Strings",enTitle:"Strings Bug",broken:`numero = 42\ntexto = "O número é: " + numero\nprint(texto)`,fixed:`numero = 42\ntexto = "O número é: " + str(numero)\nprint(texto)`,expected:"O número é: 42",ptHint:"Converta o número com str().",enHint:"Convert number with str()."},
  {id:"portal",ptTitle:"Bug dos Booleans",enTitle:"Booleans Bug",broken:`ativo = true\nif ativo:\n    print("ligado")`,fixed:`ativo = True\nif ativo:\n    print("ligado")`,expected:"ligado",ptHint:"Em Python é True, com T maiúsculo.",enHint:"In Python it's True, uppercase T."},
  {id:"museu",ptTitle:"Bug dos Tipos",enTitle:"Types Bug",broken:`a = "10"\nb = 5\nprint(a + b)`,fixed:`a = "10"\nb = 5\nprint(int(a) + b)`,expected:"15",ptHint:"Converta '10' com int().",enHint:"Convert '10' with int()."},
  {id:"espelho",ptTitle:"Bug da Recursão",enTitle:"Recursion Bug",broken:`def contagem(n):\n    print(n)\n    contagem(n-1)\n\ncontagem(3)`,fixed:`def contagem(n):\n    if n <= 0: return\n    print(n)\n    contagem(n-1)\n\ncontagem(3)`,expected:"3\n2\n1",ptHint:"Falta o caso base.",enHint:"Missing base case."},
  {id:"camara",ptTitle:"Bug do Try/Except",enTitle:"Try/Except Bug",broken:`try:\n    x = int("abc")\nexcept ZeroDivisionError:\n    print("erro tratado")`,fixed:`try:\n    x = int("abc")\nexcept ValueError:\n    print("erro tratado")`,expected:"erro tratado",ptHint:"int('abc') lança ValueError.",enHint:"int('abc') raises ValueError."},
  {id:"academia",ptTitle:"Bug das Classes",enTitle:"Classes Bug",broken:`class Heroi:\n    def __init__(nome, nivel):\n        self.nome = nome\n\nh = Heroi("Byte",1)\nprint(h.nome)`,fixed:`class Heroi:\n    def __init__(self, nome, nivel):\n        self.nome = nome\n\nh = Heroi("Byte",1)\nprint(h.nome)`,expected:"Byte",ptHint:"__init__ precisa de 'self' como primeiro parâmetro.",enHint:"__init__ needs 'self' as first parameter."},
  {id:"mensageiro",ptTitle:"Bug do Async",enTitle:"Async Bug",broken:`import asyncio\nasync def buscar():\n    asyncio.sleep(0)\n    return "pronto"\nasync def main():\n    r = buscar()\n    print(r)\nasyncio.run(main())`,fixed:`import asyncio\nasync def buscar():\n    await asyncio.sleep(0)\n    return "pronto"\nasync def main():\n    r = await buscar()\n    print(r)\nasyncio.run(main())`,expected:"pronto",ptHint:"Funções async precisam de 'await'.",enHint:"Async functions need 'await'."},
  {id:"feiticeiro",ptTitle:"Bug do Regex",enTitle:"Regex Bug",broken:`import re\ntexto = "Email: byte@code.com"\npadrao = r'[\\w]+@[\\w]+'\nemails = re.findall(padrao, texto)\nprint(emails[0])`,fixed:`import re\ntexto = "Email: byte@code.com"\npadrao = r'[\\w.]+@[\\w.]+'\nemails = re.findall(padrao, texto)\nprint(emails[0])`,expected:"byte@code.com",ptHint:"O padrão precisa de '.' para o domínio.",enHint:"Pattern needs '.' for the domain."},
  {id:"biblioteca2",ptTitle:"Bug da Ordenação",enTitle:"Sorting Bug",broken:`nums=[3,1,4,1,5]\nfor i in range(len(nums)):\n    for j in range(len(nums)-i):\n        if nums[j]>nums[j+1]:\n            nums[j],nums[j+1]=nums[j+1],nums[j]\nprint(nums)`,fixed:`nums=[3,1,4,1,5]\nfor i in range(len(nums)):\n    for j in range(len(nums)-i-1):\n        if nums[j]>nums[j+1]:\n            nums[j],nums[j+1]=nums[j+1],nums[j]\nprint(nums)`,expected:"[1, 1, 3, 4, 5]",ptHint:"Índice interno precisa de -1 extra.",enHint:"Inner index needs extra -1."},
  {id:"oraculo2",ptTitle:"Bug do Big O",enTitle:"Big O Bug",broken:`lista=[1,2,3,4,5,6,7,8]\ndef buscar(lista,alvo):\n    for item in lista:\n        if item==alvo: return True\n    return False\nprint(buscar(lista,7))`,fixed:`lista=[1,2,3,4,5,6,7,8]\ndef buscar(lista,alvo):\n    e,d=0,len(lista)-1\n    while e<=d:\n        m=(e+d)//2\n        if lista[m]==alvo: return True\n        elif lista[m]<alvo: e=m+1\n        else: d=m-1\n    return False\nprint(buscar(lista,7))`,expected:"True",ptHint:"Use busca binária O(log n) em vez de linear.",enHint:"Use binary search O(log n) instead of linear."},
  {id:"git",ptTitle:"Bug do Git",enTitle:"Git Bug",broken:`# Tentar reverter último commit permanentemente\ngit reset hard HEAD~1`,fixed:`# Reverter último commit permanentemente\ngit reset --hard HEAD~1`,expected:"Commit revertido",ptHint:"Faltam os '--' antes de 'hard'.",enHint:"Missing '--' before 'hard'."},
  {id:"api",ptTitle:"Bug da API",enTitle:"API Bug",broken:`import requests\nresp = requests.get("https://api.example.com/users")\ndata = resp.text\nusers = data["users"]`,fixed:`import requests\nresp = requests.get("https://api.example.com/users")\ndata = resp.json()\nusers = data["users"]`,expected:"lista de users",ptHint:"Use .json() para parsear JSON, não .text.",enHint:"Use .json() to parse JSON, not .text."},
  {id:"sql",ptTitle:"Bug do SQL",enTitle:"SQL Bug",broken:`SELECT nome, email\nFROM usuarios\nWHERE idade > 18\nHAVING cidade = 'SP'`,fixed:`SELECT nome, email\nFROM usuarios\nWHERE idade > 18\nAND cidade = 'SP'`,expected:"resultado correto",ptHint:"HAVING é para agregações. Use AND para filtros extras.",enHint:"HAVING is for aggregations. Use AND for extra filters."},
  {id:"testes",ptTitle:"Bug dos Testes",enTitle:"Tests Bug",broken:`def somar(a, b):\n    return a - b\n\ndef test_somar():\n    assert somar(2, 3) == 5\n\ntest_somar()`,fixed:`def somar(a, b):\n    return a + b\n\ndef test_somar():\n    assert somar(2, 3) == 5\n\ntest_somar()`,expected:"Teste passou",ptHint:"A função subtrai em vez de somar.",enHint:"The function subtracts instead of adding."},
  {id:"estruturas",ptTitle:"Bug das Estruturas",enTitle:"Data Structures Bug",broken:`pilha = []\npilha.append(1)\npilha.append(2)\npilha.append(3)\nprint(pilha.pop(0))  # LIFO`,fixed:`pilha = []\npilha.append(1)\npilha.append(2)\npilha.append(3)\nprint(pilha.pop())  # LIFO`,expected:"3",ptHint:"pop() sem argumento remove o último (LIFO). pop(0) é FIFO (fila).",enHint:"pop() without arg removes last (LIFO). pop(0) is FIFO (queue)."},
];

const ANIM_STEPS={
  taverna:[
    {code:"nome = \"Byte\"",vars:{},desc:{pt:"Antes de executar...",en:"Before executing..."}},
    {code:"nome = \"Byte\"",vars:{nome:'"Byte"'},desc:{pt:"nome recebe 'Byte'",en:"nome receives 'Byte'"}},
    {code:"nivel = 1",vars:{nome:'"Byte"',nivel:1},desc:{pt:"nivel recebe 1",en:"nivel receives 1"}},
    {code:"vida = 100",vars:{nome:'"Byte"',nivel:1,vida:100},desc:{pt:"vida recebe 100",en:"vida receives 100"}},
    {code:"print(nome)",vars:{nome:'"Byte"',nivel:1,vida:100},desc:{pt:"Saída: Byte",en:"Output: Byte"},out:"Byte"},
  ],
  torre:[
    {code:"for i in range(5):",vars:{i:"—",total:0},desc:{pt:"total=0, i ainda não existe",en:"total=0, i doesn't exist yet"}},
    {code:"    total += i  # i=0",vars:{i:0,total:0},desc:{pt:"i=0, total=0+0=0",en:"i=0, total=0+0=0"}},
    {code:"    total += i  # i=1",vars:{i:1,total:1},desc:{pt:"i=1, total=0+1=1",en:"i=1, total=0+1=1"}},
    {code:"    total += i  # i=2",vars:{i:2,total:3},desc:{pt:"i=2, total=1+2=3",en:"i=2, total=1+2=3"}},
    {code:"    total += i  # i=4",vars:{i:4,total:10},desc:{pt:"i=4, total=6+4=10",en:"i=4, total=6+4=10"}},
    {code:"print(total)",vars:{i:4,total:10},desc:{pt:"Loop terminou! Saída: 10",en:"Loop done! Output: 10"},out:"10"},
  ],
  oficina:[
    {code:"def dobrar(n):",vars:{},desc:{pt:"Definindo — nada executa ainda",en:"Defining — nothing runs yet"}},
    {code:"dobrar(5)",vars:{},desc:{pt:"Chamando com n=5",en:"Calling with n=5"}},
    {code:"    res = n * 2",vars:{n:5,res:10},desc:{pt:"res = 5 × 2 = 10",en:"res = 5 × 2 = 10"}},
    {code:"    return res",vars:{n:5,res:10},desc:{pt:"Retorna 10",en:"Returns 10"},out:"10"},
  ],
  mercado:[
    {code:"frutas = [\"maçã\",\"banana\",\"uva\"]",vars:{frutas:["maçã","banana","uva"]},desc:{pt:"3 elementos, índices 0,1,2",en:"3 elements, indices 0,1,2"}},
    {code:"frutas[0]",vars:{frutas:["maçã","banana","uva"]},desc:{pt:"Índice 0 → 'maçã'",en:"Index 0 → 'maçã'"},out:"maçã"},
    {code:"frutas.append(\"kiwi\")",vars:{frutas:["maçã","banana","uva","kiwi"]},desc:{pt:"append adiciona ao final",en:"append adds to end"}},
    {code:"len(frutas)",vars:{frutas:["maçã","banana","uva","kiwi"]},desc:{pt:"len() conta: 4 elementos",en:"len() counts: 4 elements"},out:"4"},
  ],
};

const ACH_IDS=["first_good","no_hints","streak3","speed","polyglot","sandbox_a","collector","flawless","daily","multi","boss_slayer","bug_fixer","streak7","lvl10","all_chapters","tournament_win","infinite_start"];
const ACH_ICONS=["ti-star","ti-eye-off","ti-brain","ti-bolt","ti-code","ti-terminal-2","ti-backpack","ti-trophy","ti-calendar","ti-users","ti-shield-bolt","ti-bug","ti-flame","ti-trending-up","ti-crown","ti-tournament","ti-infinity"];

function mkAudio(){try{const c=new(window.AudioContext||window.webkitAudioContext)();const t=(f,d,y="sine",v=.15)=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type=y;o.frequency.value=f;g.gain.setValueAtTime(v,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.start();o.stop(c.currentTime+d);};return{ok:()=>{t(523,.1);setTimeout(()=>t(784,.2),140);},err:()=>t(180,.3,"sawtooth",.1),click:()=>t(440,.04),win:()=>[523,659,784,1047].forEach((f,i)=>setTimeout(()=>t(f,.25),i*120)),tick:()=>t(880,.03,"square",.04),boss:()=>[349,440,523,659,784].forEach((f,i)=>setTimeout(()=>t(f,.18,i%2?"square":"sine"),i*90)),bonus:()=>{t(659,.1);setTimeout(()=>t(880,.15),120);}};}catch{return{ok:()=>{},err:()=>{},click:()=>{},win:()=>{},tick:()=>{},boss:()=>{},bonus:()=>{}};}}

function S(sc,f,lg){const ef=f+"En";return(lg==="en"&&sc[ef])?sc[ef]:sc[f];}
function SC(c,f,lg){const ef=f+"En";return(lg==="en"&&c[ef])?c[ef]:c[f];}

// ══════════════════════════════════════════════════
// v7 — DUOLINGO MODE: corações, trilha, ligas, gemas, meta diária, mascote Byt
// ══════════════════════════════════════════════════

const LEAGUES=[
  {id:"bronze",  ptName:"Bronze",   enName:"Bronze",   icon:"ti-medal",     color:"#B87333",minXP:0,   maxXP:149},
  {id:"silver",  ptName:"Prata",    enName:"Silver",   icon:"ti-medal-2",   color:"#A0A0A0",minXP:150, maxXP:399},
  {id:"gold",    ptName:"Ouro",     enName:"Gold",     icon:"ti-medal",     color:"#EF9F27",minXP:400, maxXP:749},
  {id:"diamond", ptName:"Diamante", enName:"Diamond",  icon:"ti-diamond",   color:"#5DCAA5",minXP:750, maxXP:1199},
  {id:"sapphire",ptName:"Safira",   enName:"Sapphire", icon:"ti-hexagon",   color:"#378ADD",minXP:1200,maxXP:1999},
  {id:"ruby",    ptName:"Rubi",     enName:"Ruby",     icon:"ti-flame",     color:"#E24B4A",minXP:2000,maxXP:Infinity},
];
function getLeague(xp){return LEAGUES.reduce((a,l)=>xp>=l.minXP?l:a,LEAGUES[0]);}

const DAILY_GOALS=[
  {id:"casual",  pts:10,ptLabel:"Casual",    enLabel:"Casual"},
  {id:"regular", pts:20,ptLabel:"Regular",   enLabel:"Regular"},
  {id:"intense", pts:30,ptLabel:"Intenso",   enLabel:"Intense"},
];

const BYT_MSGS={
  correct:  {pt:["Excelente! 🎉","Isso!","Você arrasou!","Byt aprova! ✓","Continue assim!"],
             en:["Excellent! 🎉","Yes!","You crushed it!","Byt approves! ✓","Keep it up!"]},
  wrong:    {pt:["Ops! Tente de novo","Quase...","Errou, mas aprende!","Não desanime!"],
             en:["Oops! Try again","Almost...","Wrong, but you learn!","Don't give up!"]},
  boss:     {pt:["Um boss! Cuidado!","Hora de brilhar!","Mostre seu poder!"],
             en:["A boss! Be careful!","Time to shine!","Show your power!"]},
  streak:   {pt:["Streak incrível! 🔥","Imparável!","Lendário!"],
             en:["Amazing streak! 🔥","Unstoppable!","Legendary!"]},
  start:    {pt:["Bora codar!","Vamos aprender!","Pronto pra aventura?"],
             en:["Let's code!","Time to learn!","Ready for adventure?"]},
  nohearts: {pt:["Sem vidas! Use gemas...","Precisas de vidas!","Recarregue para continuar!"],
             en:["No lives! Use gems...","You need lives!","Recharge to continue!"]},
  gems:     {pt:["Gemas gastas!","Vida restaurada!"],en:["Gems spent!","Life restored!"]},
  dailydone:{pt:["Meta do dia atingida! ⭐","Dia perfeito!"],en:["Daily goal reached! ⭐","Perfect day!"]},
};
function bytMsg(key,lang){const arr=BYT_MSGS[key]?.[lang==="en"?"en":"pt"]||["..."];return arr[Math.floor(Math.random()*arr.length)];}

// ── MASCOT BYT ────────────────────────────────────────────────
function BytMascot({msg,mood,T,onClose}){
  const[visible,setVisible]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>{setVisible(false);if(onClose)onClose();},2800);return()=>clearTimeout(t);},[msg]);
  if(!visible)return null;
  const moodEmoji={correct:"(✿◕‿◕)",wrong:"(╥_╥)",boss:"(⌐■_■)",streak:"(★‿★)",start:"(◕‿◕)"}[mood]||"(·‿·)";
  const moodColor={correct:"rgba(93,202,165,.2)",wrong:"rgba(216,90,48,.12)",boss:"rgba(216,90,48,.12)",streak:"rgba(239,159,39,.15)",start:T.al}[mood]||T.al;
  const moodBorder={correct:"rgba(93,202,165,.45)",wrong:"rgba(216,90,48,.35)",boss:"rgba(216,90,48,.4)",streak:"rgba(239,159,39,.5)",start:T.ab}[mood]||T.ab;
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:8,marginBottom:"1rem",animation:"slideUp 0.3s ease"}}>
      <div style={{fontSize:22,lineHeight:1,flexShrink:0,animation:mood==="correct"?"bytBounce 0.6s ease":undefined}}>{moodEmoji}</div>
      <div style={{background:moodColor,border:`0.5px solid ${moodBorder}`,borderRadius:"12px 12px 12px 3px",padding:"6px 12px",fontSize:12,color:T.tx,fontFamily:"Georgia,serif",maxWidth:220,lineHeight:1.5}}>
        <span style={{fontWeight:500,color:T.am,fontSize:10,display:"block",marginBottom:2}}>Byt</span>
        {msg}
      </div>
    </div>
  );
}

// ── HEARTS + GEMS DISPLAY ─────────────────────────────────────
function HeartsDisplay({hearts,maxHearts,T}){
  return(
    <div style={{display:"flex",gap:3,alignItems:"center"}}>
      {Array.from({length:maxHearts},(_,i)=>(
        <i key={i} className="ti ti-heart" style={{fontSize:16,color:i<hearts?"#E24B4A":"rgba(224,212,180,.2)",transition:"color 0.4s"}} aria-hidden="true"/>
      ))}
    </div>
  );
}
function GemsDisplay({gems,T}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:4,background:"rgba(93,202,165,.1)",border:"0.5px solid rgba(93,202,165,.3)",borderRadius:20,padding:"2px 8px"}}>
      <i className="ti ti-diamond" style={{fontSize:12,color:"#5DCAA5"}} aria-hidden="true"/>
      <span style={{fontSize:12,fontWeight:500,color:"#5DCAA5"}}>{gems}</span>
    </div>
  );
}

// ── LEAGUE BADGE ──────────────────────────────────────────────
function LeagueBadge({xp,lang,onClick,T}){
  const lg=getLeague(xp);
  return(
    <button onClick={onClick} style={{background:`rgba(239,159,39,.08)`,border:`0.5px solid rgba(239,159,39,.25)`,borderRadius:20,padding:"2px 9px",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
      <i className={`ti ${lg.icon}`} style={{fontSize:12,color:lg.color}} aria-hidden="true"/>
      <span style={{fontSize:11,fontWeight:500,color:lg.color}}>{lang==="en"?lg.enName:lg.ptName}</span>
    </button>
  );
}

// ── DAILY GOAL BAR ────────────────────────────────────────────
function DailyGoalBar({dailyXP,dailyGoalPts,lang,T,L}){
  const pct=Math.min(100,Math.round((dailyXP/dailyGoalPts)*100));const done=pct>=100;
  return(
    <div style={{marginBottom:6}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
        <span style={{fontSize:10,color:done?"#5DCAA5":T.mt,display:"flex",alignItems:"center",gap:4}}>
          <i className="ti ti-target" style={{fontSize:10}} aria-hidden="true"/>
          {lang==="en"?"Daily goal":"Meta diária"}
          {done&&<i className="ti ti-check" style={{fontSize:10,color:"#5DCAA5"}} aria-hidden="true"/>}
        </span>
        <span style={{fontSize:10,color:done?"#5DCAA5":T.mt}}>{Math.min(dailyXP,dailyGoalPts)}/{dailyGoalPts} XP</span>
      </div>
      <div style={{height:4,background:T.al,borderRadius:99,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:done?"#5DCAA5":T.am,borderRadius:99,transition:"width 0.8s ease"}}/>
      </div>
    </div>
  );
}

// ── HEART LOST MODAL ──────────────────────────────────────────
function HeartLostModal({hearts,maxHearts,gems,onGemRefill,onContinue,lang,T,L}){
  const noHearts=hearts===0;
  return(
    <div style={{minHeight:340,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,marginBottom:"1rem"}}>
      <div style={{background:T.sf,border:`0.5px solid rgba(216,90,48,.4)`,borderRadius:12,padding:"2rem",textAlign:"center",maxWidth:280}}>
        <div style={{fontSize:36,marginBottom:"0.75rem"}}>{noHearts?"💀":"❤️"}</div>
        <p style={{fontSize:10,letterSpacing:3,color:"#E24B4A",textTransform:"uppercase",marginBottom:"0.5rem"}}>{noHearts?(lang==="en"?"Game over":"Sem vidas!"):(lang==="en"?"Oops!":"Ops!")}</p>
        <p style={{fontSize:"1rem",color:T.tx,marginBottom:"0.5rem",fontFamily:"Georgia,serif"}}>{noHearts?(lang==="en"?"You're out of hearts":"Você ficou sem corações!"):(lang==="en"?"Wrong answer — lost a heart":"Resposta errada — perdeu um coração!")}</p>
        <div style={{marginBottom:"1.25rem"}}><HeartsDisplay hearts={hearts} maxHearts={maxHearts} T={T}/></div>
        {gems>=10&&<div style={{marginBottom:"0.75rem"}}>
          <p style={{fontSize:12,color:T.mt,marginBottom:"0.5rem"}}>{lang==="en"?`Refill 1 heart for 10 gems (${gems} available)`:`Refazer 1 coração por 10 gemas (${gems} disponíveis)`}</p>
          <NBtn onClick={onGemRefill} T={T}><i className="ti ti-diamond" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>10 {lang==="en"?"gems → +1 heart":"gemas → +1 coração"}</NBtn>
        </div>}
        {(!noHearts||gems>=10)&&<button onClick={onContinue} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:12,fontFamily:"Georgia,serif",display:"block",margin:"0.5rem auto 0"}}>{lang==="en"?"Continue anyway →":"Continuar assim →"}</button>}
        {noHearts&&gems<10&&<p style={{fontSize:12,color:T.mt,fontFamily:"Georgia,serif",marginTop:"0.5rem"}}>{lang==="en"?"Come back in 4 hours or earn more gems!":"Volte em 4 horas ou ganhe mais gemas!"}</p>}
      </div>
    </div>
  );
}

// ── GEM SHOP ──────────────────────────────────────────────────
function GemShop({gems,hearts,maxHearts,lang,T,onBuy,onClose}){
  const items=[
    {id:"heart1",icon:"ti-heart",cost:10,ptLabel:"Refazer 1 coração",enLabel:"Refill 1 heart",available:hearts<maxHearts},
    {id:"heart5",icon:"ti-heart",cost:40,ptLabel:"Refazer todos os corações",enLabel:"Refill all hearts",available:hearts<maxHearts},
    {id:"timer",icon:"ti-clock-off",cost:15,ptLabel:"Pular timer (próximo boss)",enLabel:"Skip timer (next boss)",available:true},
    {id:"hint",icon:"ti-bulb",cost:5,ptLabel:"Dica grátis (próxima lição)",enLabel:"Free hint (next lesson)",available:true},
  ];
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}>
      <button onClick={onClose} style={{background:"transparent",border:"none",color:"rgba(224,212,180,.45)",cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>Voltar</button>
      <p style={{fontSize:10,letterSpacing:3,color:"#5DCAA5",textTransform:"uppercase",margin:0}}>Loja de Gemas</p>
      <div style={{marginLeft:"auto"}}><GemsDisplay gems={gems} T={T}/></div>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {items.map(item=>{const canBuy=gems>=item.cost&&item.available;return(<div key={item.id} style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:10,padding:"0.9rem 1.1rem",display:"flex",alignItems:"center",gap:12,opacity:canBuy?1:0.5}}>
        <i className={`ti ${item.icon}`} style={{fontSize:22,color:"#5DCAA5",flexShrink:0}} aria-hidden="true"/>
        <div style={{flex:1}}>
          <div style={{fontSize:13,color:T.tx,fontFamily:"Georgia,serif"}}>{lang==="en"?item.enLabel:item.ptLabel}</div>
          <div style={{display:"flex",alignItems:"center",gap:4,marginTop:3}}>
            <i className="ti ti-diamond" style={{fontSize:11,color:"#5DCAA5"}} aria-hidden="true"/>
            <span style={{fontSize:11,color:"#5DCAA5",fontWeight:500}}>{item.cost} gemas</span>
          </div>
        </div>
        <button onClick={()=>canBuy&&onBuy(item)} disabled={!canBuy} style={{background:canBuy?"rgba(93,202,165,.12)":"transparent",border:`0.5px solid ${canBuy?"rgba(93,202,165,.45)":T.ab}`,color:canBuy?"#5DCAA5":"rgba(224,212,180,.3)",padding:"5px 14px",borderRadius:6,cursor:canBuy?"pointer":"default",fontSize:12,fontFamily:"Georgia,serif"}}>{lang==="en"?"Buy":"Comprar"}</button>
      </div>);})}
    </div>
  </div>);}

// ── SKILL PATH (main screen replacement) ─────────────────────
function SkillPath({scenes,inventory,sceneIdx,lang,T,L,onPickScene,onStartLesson,dailyXP,dailyGoalPts,hearts,maxHearts,gems,weeklyXP,streak,xpData,settings,setSettings,onMulti,onTournament,onLeagues,onGemShop}){
  const[showSettings,setShowSettings]=useState(false);
  const done=inventory.map(i=>i.id);
  // zigzag offsets
  const zigzag=[0,40,-20,20,-40,0,40,-20,20,-40,0,40,-20,20,-40,0,40,-20,20,-40,0,40];
  const lg=getLeague(weeklyXP);const xpTitle=lang==="en"?xpData.enTi:xpData.ptTi;
  return(<div>
    {/* TOP BAR */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:13,fontWeight:500,color:"#D85A30",display:"flex",alignItems:"center",gap:4}}><i className="ti ti-flame" style={{fontSize:16,color:"#D85A30"}} aria-hidden="true"/>{streak}</span>
        <LeagueBadge xp={weeklyXP} lang={lang} onClick={onLeagues} T={T}/>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <button onClick={onGemShop} style={{background:"transparent",border:"none",cursor:"pointer",padding:0}}><GemsDisplay gems={gems} T={T}/></button>
        <HeartsDisplay hearts={hearts} maxHearts={maxHearts} T={T}/>
        <button onClick={()=>setShowSettings(s=>!s)} style={{background:"transparent",border:"none",color:"rgba(224,212,180,.45)",cursor:"pointer",fontSize:14,padding:"2px 4px"}}><i className="ti ti-settings" style={{fontSize:16}} aria-hidden="true"/></button>
      </div>
    </div>

    {/* DAILY GOAL */}
    <DailyGoalBar dailyXP={dailyXP} dailyGoalPts={dailyGoalPts} lang={lang} T={T} L={L}/>

    {/* SETTINGS PANEL */}
    {showSettings&&<div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:10,padding:"1rem",marginBottom:"1rem"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:"0.75rem"}}>
        {[["theme",[["dark","Grimório"],["light","Pergaminho"],["cyber","Neon"]]],
          ["language",[["py","Python"],["js","JavaScript"],["both","Ambas"]]],
          ["career",[["all","Todos"],["frontend","Front"],["backend","Back"],["data","Data"]]],
        ].map(([key,opts])=>(<div key={key}>
          <p style={{fontSize:9,letterSpacing:2,color:T.am,textTransform:"uppercase",marginBottom:4}}>{key}</p>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{opts.map(([v,l])=>(<button key={v} onClick={()=>setSettings(s=>({...s,[key]:v}))} style={{background:settings[key]===v?T.al:"transparent",border:`0.5px solid ${settings[key]===v?T.am:T.ab}`,color:settings[key]===v?T.am:T.mt,padding:"3px 8px",borderRadius:4,cursor:"pointer",fontSize:10,fontFamily:"Georgia,serif"}}>{settings[key]===v?"✓ ":""}{l}</button>))}</div>
        </div>))}
      </div>
      <div style={{marginBottom:"0.75rem"}}>
        <p style={{fontSize:9,letterSpacing:2,color:T.am,textTransform:"uppercase",marginBottom:4}}>Meta diária</p>
        <div style={{display:"flex",gap:4}}>{DAILY_GOALS.map(g=>(<button key={g.id} onClick={()=>setSettings(s=>({...s,dailyGoal:g.id}))} style={{background:settings.dailyGoal===g.id?T.al:"transparent",border:`0.5px solid ${settings.dailyGoal===g.id?T.am:T.ab}`,color:settings.dailyGoal===g.id?T.am:T.mt,padding:"3px 8px",borderRadius:4,cursor:"pointer",fontSize:10,fontFamily:"Georgia,serif"}}>{settings.dailyGoal===g.id?"✓ ":""}{lang==="en"?g.enLabel:g.ptLabel} ({g.pts})</button>))}</div>
      </div>
      <div style={{marginBottom:"0.5rem"}}>
        <p style={{fontSize:9,letterSpacing:2,color:T.am,textTransform:"uppercase",marginBottom:4}}>Nome</p>
        <input value={settings.p1||""} onChange={e=>setSettings(s=>({...s,p1:e.target.value}))} placeholder="Byte" style={{background:T.cb,border:`0.5px solid ${T.ab}`,color:T.tx,padding:"4px 8px",borderRadius:4,fontSize:12,fontFamily:"Georgia,serif",outline:"none",width:"100%",boxSizing:"border-box"}}/>
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"space-between"}}>
        {[["pt","🇧🇷 PT"],["en","🇺🇸 EN"]].map(([v,l])=>(<button key={v} onClick={()=>setSettings(s=>({...s,lang:v}))} style={{background:settings.lang===v?T.al:"transparent",border:`0.5px solid ${settings.lang===v?T.am:T.ab}`,color:settings.lang===v?T.am:T.mt,padding:"4px 12px",borderRadius:20,cursor:"pointer",fontSize:12,fontFamily:"Georgia,serif"}}>{l}</button>))}
      </div>
    </div>}

    {/* TITLE + BYT */}
    <div style={{textAlign:"center",marginBottom:"1rem"}}>
      <div style={{fontSize:28,marginBottom:4}}>⚔️</div>
      <h1 style={{fontSize:"1.5rem",fontWeight:"normal",color:T.tx,margin:"0 0 2px",letterSpacing:"1.5px",fontFamily:"Georgia,serif"}}>{lang==="en"?"Lands of Code":"Terras do Código"}</h1>
      <p style={{fontSize:11,color:T.mt,fontFamily:"Georgia,serif",margin:"0 0 4px"}}>{lang==="en"?`Level ${xpData.lvl} · ${xpData.xp} XP`:`Nível ${xpData.lvl} · ${xpData.xp} XP`}</p>
    </div>

    {/* SKILL PATH NODES */}
    <div style={{padding:"0 1rem 1rem",position:"relative"}}>
      {scenes.map((sc,i)=>{
        const isDone=done.includes(sc.id);const isActive=i===sceneIdx;const isLocked=i>sceneIdx&&!isDone;
        const isBossAfter=BOSSES.some(b=>b.afterIdx===i-1);
        const offset=zigzag[i%zigzag.length]||0;
        const chLabel=lang==="en"?(sc.chEn||sc.ch):sc.ch;
        let bg,border,iconColor,cursor;
        if(isDone){bg="#5DCAA5";border="rgba(29,158,117,.6)";iconColor="white";cursor="pointer";}
        else if(isActive){bg="#7F77DD";border="rgba(83,74,183,.7)";iconColor="white";cursor="pointer";}
        else{bg=T.sf;border=T.ab;iconColor="rgba(224,212,180,.3)";cursor="default";}
        return(<div key={sc.id}>
          {isBossAfter&&i>0&&<div style={{marginLeft:`calc(50% + ${offset}px - 2px)`,width:4,height:28,background:"rgba(216,90,48,.3)",borderRadius:2,marginBottom:4}}/>}
          {isBossAfter&&i>0&&<div style={{display:"flex",justifyContent:"center",marginBottom:4}}>
            <div title="Checkpoint" style={{width:48,height:48,borderRadius:"50%",background:"#E24B4A",border:"3px solid rgba(163,45,45,.7)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"default",marginLeft:offset}}>
              <i className="ti ti-shield-bolt" style={{fontSize:22,color:"white"}} aria-hidden="true"/>
            </div>
          </div>}
          {i>0&&!isBossAfter&&<div style={{marginLeft:`calc(50% + ${offset}px - 2px)`,width:4,height:22,background:isDone?"rgba(93,202,165,.4)":"rgba(224,212,180,.12)",borderRadius:2,marginBottom:4}}/>}
          <div style={{display:"flex",justifyContent:"center",marginBottom:6}}>
            <div style={{marginLeft:offset,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
              <div onClick={()=>!isLocked&&onPickScene(i)} style={{width:58,height:58,borderRadius:"50%",background:bg,border:`3px solid ${border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor,position:"relative",animation:isActive?"nodePulse 2.2s ease-in-out infinite":undefined,transition:"transform 0.2s"}}>
                <i className={`ti ${isLocked?"ti-lock":sc.icon}`} style={{fontSize:22,color:iconColor}} aria-hidden="true"/>
                {isDone&&<div style={{position:"absolute",bottom:-2,right:-2,width:16,height:16,borderRadius:"50%",background:"white",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ti ti-check" style={{fontSize:9,color:"#5DCAA5"}} aria-hidden="true"/></div>}
              </div>
              <span style={{fontSize:10,color:isActive?T.am:isDone?"#5DCAA5":"rgba(224,212,180,.4)",textAlign:"center",maxWidth:65,lineHeight:1.3,fontFamily:"Georgia,serif"}}>{chLabel}</span>
              {isActive&&<NBtn onClick={()=>onStartLesson(i)} T={T} >{lang==="en"?"Start →":"Iniciar →"}</NBtn>}
            </div>
          </div>
        </div>);
      })}
    </div>

    {/* BOTTOM ACTION BAR */}
    <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap",marginTop:"0.5rem",paddingBottom:"1rem",borderTop:`0.5px solid ${T.ab}`,paddingTop:"1rem"}}>
      <button onClick={onMulti} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif",display:"flex",alignItems:"center",gap:4}}><i className="ti ti-users" style={{fontSize:12}} aria-hidden="true"/>Multi</button>
      <button onClick={onTournament} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif",display:"flex",alignItems:"center",gap:4}}><i className="ti ti-tournament" style={{fontSize:12}} aria-hidden="true"/>Torneio</button>
      <button onClick={onLeagues} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif",display:"flex",alignItems:"center",gap:4}}><i className="ti ti-medal" style={{fontSize:12}} aria-hidden="true"/>Ligas</button>
    </div>
    <style>{`@keyframes nodePulse{0%,100%{box-shadow:0 0 0 0 rgba(127,119,221,.45)}50%{box-shadow:0 0 0 10px rgba(127,119,221,0)}}@keyframes slideUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}@keyframes bytBounce{0%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
  </div>);}

// ── LEAGUES SCREEN ────────────────────────────────────────────
function LeaguesScreen({weeklyXP,lang,T,onBack}){
  const current=getLeague(weeklyXP);
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}>
      <button onClick={onBack} style={{background:"transparent",border:"none",color:"rgba(224,212,180,.45)",cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{lang==="en"?"Back":"Voltar"}</button>
      <p style={{fontSize:10,letterSpacing:3,color:"#EF9F27",textTransform:"uppercase",margin:0}}>{lang==="en"?"Leagues":"Ligas"}</p>
    </div>
    <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
      <i className={`ti ${current.icon}`} style={{fontSize:40,color:current.color,display:"block",marginBottom:"0.5rem"}} aria-hidden="true"/>
      <p style={{fontSize:"1.3rem",color:current.color,fontFamily:"Georgia,serif",marginBottom:"0.25rem"}}>{lang==="en"?"League "+current.enName:"Liga "+current.ptName}</p>
      <p style={{fontSize:12,color:"rgba(224,212,180,.45)"}}>{weeklyXP} XP {lang==="en"?"this week":"esta semana"}</p>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {LEAGUES.map((lg,i)=>{
        const isCur=lg.id===current.id;const isPast=weeklyXP>=(LEAGUES[i+1]?.minXP||Infinity);
        return(<div key={lg.id} style={{background:isCur?`${lg.color}18`:T.sf,border:`0.5px solid ${isCur?lg.color:T.ab}`,borderRadius:10,padding:"0.85rem 1.1rem",display:"flex",alignItems:"center",gap:12}}>
          <i className={`ti ${lg.icon}`} style={{fontSize:22,color:isCur?lg.color:"rgba(224,212,180,.3)",flexShrink:0}} aria-hidden="true"/>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:isCur?500:400,color:isCur?lg.color:T.tx,fontFamily:"Georgia,serif"}}>{lang==="en"?lg.enName:lg.ptName}</div>
            <div style={{fontSize:11,color:"rgba(224,212,180,.45)"}}>{lg.minXP}–{lg.maxXP===Infinity?"∞":lg.maxXP} XP</div>
          </div>
          {isCur&&<span style={{fontSize:10,background:`${lg.color}20`,color:lg.color,padding:"2px 10px",borderRadius:4}}>← você</span>}
          {isPast&&!isCur&&<i className="ti ti-check" style={{fontSize:14,color:"#5DCAA5"}} aria-hidden="true"/>}
        </div>);
      })}
    </div>
  </div>);}



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
,
  {id:"git",ch:"Cap. 18",chEn:"Ch. 18",icon:"ti-git-branch",portrait:{ic:"ti-history",cl:"#5DCAA5",nm:"Guardião das Versões",nmEn:"Version Guardian"},mapPos:{x:22,y:18},
   item:{icon:"ti-git-commit",name:"Cristal do Commit",nameEn:"Commit Crystal"},
   narr:`A Câmara das Versões guarda todo o histórico do reino. O guardião explica:\n\n— Cada mudança fica registrada para sempre. Você pode voltar a qualquer ponto.\n\nComo registrar uma alteração no histórico?`,
   narrH:`O guardião precisa que você registre sua mudança no histórico. Como?`,
   narrEn:`The Chamber of Versions holds all kingdom history. The guardian explains:\n\n— Every change is recorded forever. You can go back to any point.\n\nHow do you record a change in history?`,
   narrHEn:`The guardian needs you to record your change in history. How?`,
   hint:"Git: add para preparar, commit para registrar, push para enviar.",
   hintEn:"Git: add to stage, commit to record, push to send.",
   concept:{nm:"Git",nmEn:"Git",cl:"#5DCAA5",bg:"rgba(93,202,165,.07)",bd:"rgba(93,202,165,.22)",
    sum:"Git rastreia mudanças em arquivos. Commit salva um snapshot, branch isola trabalho, merge une branches.",
    sumEn:"Git tracks file changes. Commit saves a snapshot, branch isolates work, merge joins branches.",
    py:`# Git não é Python, mas é essencial\n\n# Fluxo básico:\n# git init          → inicia repositório\n# git add arquivo   → prepara mudança\n# git commit -m ""  → salva snapshot\n# git push          → envia ao servidor\n# git pull          → baixa mudanças\n# git branch nova   → cria branch\n# git merge nova    → une branches`,
    js:`// Git — ferramenta de linha de comando\n\n// Fluxo básico:\n// git init          // inicia repo\n// git add .         // prepara tudo\n// git commit -m ""  // salva snapshot\n// git push          // envia\n// git pull          // baixa\n// git branch feat   // nova branch\n// git merge feat    // une`},
   choices:[
    {text:"git add . && git commit -m 'minha mudança'",textEn:"git add . && git commit -m 'my change'",good:true,
     cons:`Snapshot registrado! O histórico preserva sua mudança para sempre.\n\n— GIT! add prepara, commit registra. Cada commit é imutável — nunca se perde.`,
     consEn:`Snapshot recorded! The history preserves your change forever.\n\n— GIT! add stages, commit records. Each commit is immutable — never lost.`},
    {text:"Salvar o arquivo e confiar na memória",textEn:"Save the file and trust your memory",good:false,
     cons:`Você modificou 50 arquivos em 3 semanas. Onde estava a versão que funcionava?\n\n— Git existe exatamente para isso.`,
     consEn:`You've modified 50 files over 3 weeks. Where was the working version?\n\n— Git exists exactly for this.`,
     branch:`— git log mostra todos os commits. git checkout volta ao que quiser. Memória não tem isso.`,
     branchEn:`— git log shows all commits. git checkout returns to any. Memory can't do that.`}],
   quiz:{q:"O que 'git commit' faz?",qEn:"What does 'git commit' do?",opts:["Envia ao servidor","Salva snapshot local","Cria branch"],optsEn:["Sends to server","Saves local snapshot","Creates branch"],ok:1}},

  {id:"api",ch:"Cap. 19",chEn:"Ch. 19",icon:"ti-cloud",portrait:{ic:"ti-plug",cl:"#378ADD",nm:"Mensageiro da Nuvem",nmEn:"Cloud Messenger"},mapPos:{x:60,y:15},
   item:{icon:"ti-cloud-download",name:"Dados da Nuvem",nameEn:"Cloud Data"},
   narr:`O Mensageiro da Nuvem controla o fluxo de informações entre sistemas:\n\n— Preciso buscar os dados dos usuários em outro servidor. Como você faz isso?`,
   narrH:`Precisa buscar dados de outro servidor via HTTP. Qual o método correto?`,
   narrEn:`The Cloud Messenger controls information flow between systems:\n\n— I need to fetch user data from another server. How do you do it?`,
   narrHEn:`Need to fetch data from another server via HTTP. What's the correct method?`,
   hint:"Use GET para buscar dados, POST para enviar, PUT para atualizar, DELETE para remover.",
   hintEn:"Use GET to fetch data, POST to send, PUT to update, DELETE to remove.",
   concept:{nm:"APIs e HTTP",nmEn:"APIs & HTTP",cl:"#378ADD",bg:"rgba(55,138,221,.07)",bd:"rgba(55,138,221,.22)",
    sum:"APIs permitem comunicação entre sistemas. HTTP usa verbos (GET/POST/PUT/DELETE) e retorna status (200 ok, 404 não encontrado, 500 erro).",
    sumEn:"APIs allow systems to communicate. HTTP uses verbs (GET/POST/PUT/DELETE) and returns status codes (200 ok, 404 not found, 500 error).",
    py:`import requests\n\n# GET — buscar dados\nresp = requests.get("https://api.exemplo.com/users")\nif resp.status_code == 200:\n    data = resp.json()\n    print(data["users"])\n\n# POST — enviar dados\nresp = requests.post(\n    "https://api.exemplo.com/users",\n    json={"nome": "Byte"}\n)`,
    js:`// GET — buscar dados\nconst resp = await fetch("https://api.example.com/users");\nif (resp.ok) {\n    const data = await resp.json();\n    console.log(data.users);\n}\n\n// POST — enviar dados\nawait fetch("https://api.example.com/users", {\n    method: "POST",\n    headers: {"Content-Type": "application/json"},\n    body: JSON.stringify({name: "Byte"})\n});`},
   choices:[
    {text:"GET /api/usuarios — buscar todos",textEn:"GET /api/users — fetch all",good:true,
     cons:`200 OK! Os dados chegam como JSON.\n\n— APIs são a linguagem dos sistemas modernos. GET para ler, POST para criar.`,
     consEn:`200 OK! Data arrives as JSON.\n\n— APIs are the language of modern systems. GET to read, POST to create.`},
    {text:"POST /api/usuarios — enviar vazio",textEn:"POST /api/users — send empty",good:false,
     cons:`400 Bad Request! POST cria dados, não os busca.\n\n— GET é para buscar. POST é para criar.`,
     consEn:`400 Bad Request! POST creates data, it doesn't fetch it.\n\n— GET is for fetching. POST is for creating.`,
     branch:`— REST: GET=buscar, POST=criar, PUT=atualizar, DELETE=remover. Verbos importam.`,
     branchEn:`— REST: GET=fetch, POST=create, PUT=update, DELETE=remove. Verbs matter.`}],
   quiz:{q:"Status 200 significa:",qEn:"Status 200 means:",opts:["Erro do servidor","Sucesso","Não encontrado"],optsEn:["Server error","Success","Not found"],ok:1}},

  {id:"sql",ch:"Cap. 20",chEn:"Ch. 20",icon:"ti-database",portrait:{ic:"ti-table",cl:"#9F77DD",nm:"Arquivista dos Dados",nmEn:"Data Archivist"},mapPos:{x:90,y:18},
   item:{icon:"ti-database",name:"Tábua do Banco",nameEn:"Database Tablet"},
   narr:`O Arquivo dos Dados guarda toda informação do reino em tabelas estruturadas:\n\n— Preciso encontrar todos os heróis com nível maior que 5. Como consultar?`,
   narrH:`Banco de dados com tabela 'herois'. Buscar onde nivel > 5. Como?`,
   narrEn:`The Data Archive stores all kingdom information in structured tables:\n\n— I need to find all heroes with level greater than 5. How to query?`,
   narrHEn:`Database with table 'heroes'. Find where level > 5. How?`,
   hint:"SQL: SELECT coluna FROM tabela WHERE condição.",
   hintEn:"SQL: SELECT column FROM table WHERE condition.",
   concept:{nm:"SQL Básico",nmEn:"Basic SQL",cl:"#9F77DD",bg:"rgba(159,119,221,.07)",bd:"rgba(159,119,221,.22)",
    sum:"SQL consulta bancos relacionais. SELECT busca dados, WHERE filtra, JOIN une tabelas, GROUP BY agrupa.",
    sumEn:"SQL queries relational databases. SELECT fetches data, WHERE filters, JOIN merges tables, GROUP BY groups.",
    py:`# Python com SQLite\nimport sqlite3\n\ncon = sqlite3.connect("reino.db")\ncur = con.cursor()\n\n# SELECT com filtro\ncur.execute("SELECT nome, nivel FROM herois WHERE nivel > 5")\nherois = cur.fetchall()\n\n# INSERT\ncur.execute("INSERT INTO herois VALUES (?,?)", ("Byte", 1))\ncon.commit()`,
    js:`// Node.js com melhor-sqlite3\nconst db = require('better-sqlite3')('reino.db');\n\n// SELECT com filtro\nconst herois = db\n    .prepare("SELECT nome, nivel FROM herois WHERE nivel > 5")\n    .all();\n\n// INSERT\ndb.prepare("INSERT INTO herois VALUES (?,?)")\n    .run("Byte", 1);`},
   choices:[
    {text:"SELECT nome, nivel FROM herois WHERE nivel > 5",textEn:"SELECT nome, nivel FROM herois WHERE nivel > 5",good:true,
     cons:`Todos os heróis nível 6+ retornados em milissegundos!\n\n— SQL é declarativo: diga O QUE quer, não COMO buscar. O banco decide o caminho.`,
     consEn:`All heroes level 6+ returned in milliseconds!\n\n— SQL is declarative: say WHAT you want, not HOW to find it. The database decides the path.`},
    {text:"Ler todos e filtrar manualmente em código",textEn:"Read all and filter manually in code",good:false,
     cons:`Com 1 milhão de registros: lento e ineficiente.\n\n— Deixe o banco filtrar — foi construído exatamente para isso.`,
     consEn:`With 1 million records: slow and inefficient.\n\n— Let the database filter — it was built exactly for that.`,
     branch:`— WHERE no banco = índice otimizado. WHERE no código = varredura completa. Enorme diferença.`,
     branchEn:`— WHERE in DB = optimized index. WHERE in code = full scan. Huge difference.`}],
   quiz:{q:"Para que serve WHERE em SQL?",qEn:"What does WHERE do in SQL?",opts:["Ordenar resultados","Filtrar linhas","Selecionar colunas"],optsEn:["Sort results","Filter rows","Select columns"],ok:1}},

  {id:"testes",ch:"Cap. 21",chEn:"Ch. 21",icon:"ti-test-pipe",portrait:{ic:"ti-shield-check",cl:"#D4537E",nm:"Guardiã da Qualidade",nmEn:"Quality Guardian"},mapPos:{x:92,y:65},
   item:{icon:"ti-test-pipe",name:"Frasco de Testes",nameEn:"Test Flask"},
   narr:`A Arena dos Testes. A guardiã explica:\n\n— Código sem teste é código que você não confia. Como você garante que somar(2,3) sempre retorna 5?`,
   narrH:`Função somar(a,b). Como garantir que sempre funciona corretamente?`,
   narrEn:`The Testing Arena. The guardian explains:\n\n— Code without tests is code you don't trust. How do you guarantee somar(2,3) always returns 5?`,
   narrHEn:`Function somar(a,b). How do you guarantee it always works correctly?`,
   hint:"Escreva uma função que verifica automaticamente o comportamento esperado.",
   hintEn:"Write a function that automatically verifies the expected behavior.",
   concept:{nm:"Testes Unitários",nmEn:"Unit Tests",cl:"#D4537E",bg:"rgba(212,83,126,.07)",bd:"rgba(212,83,126,.22)",
    sum:"Testes unitários verificam automaticamente o comportamento do código. assert garante que o resultado é o esperado.",
    sumEn:"Unit tests automatically verify code behavior. assert guarantees the result is as expected.",
    py:`def somar(a, b):\n    return a + b\n\n# Teste unitário\ndef test_somar():\n    assert somar(2, 3) == 5\n    assert somar(-1, 1) == 0\n    assert somar(0, 0) == 0\n    print("Todos os testes passaram!")\n\ntest_somar()\n\n# Com pytest:\n# pytest test_somar.py`,
    js:`function somar(a, b) { return a + b; }\n\n// Com Jest:\ntest('somar dois números', () => {\n    expect(somar(2, 3)).toBe(5);\n    expect(somar(-1, 1)).toBe(0);\n});\n\n// Rodar:\n// npx jest`},
   choices:[
    {text:"Escrever test_somar() com assert",textEn:"Write test_somar() with assert",good:true,
     cons:`Verde! Todos os casos passaram.\n\n— TESTES! Mude o código amanhã — os testes detectam regressões automaticamente.`,
     consEn:`Green! All cases passed.\n\n— TESTS! Change the code tomorrow — tests automatically detect regressions.`},
    {text:"Testar manualmente no terminal toda vez",textEn:"Test manually in terminal every time",good:false,
     cons:`Esquecível, demorado e não documentado.\n\n— Testes automáticos rodam em segundos, sempre, com zero esforço.`,
     consEn:`Forgettable, slow, and undocumented.\n\n— Automated tests run in seconds, always, with zero effort.`,
     branch:`— test_somar() documenta o comportamento E verifica automaticamente. Dois em um.`,
     branchEn:`— test_somar() documents the behavior AND verifies automatically. Two in one.`}],
   quiz:{q:"assert a == b faz o que?",qEn:"What does assert a == b do?",opts:["Atribui b a a","Lança erro se a≠b","Compara sem errar"],optsEn:["Assigns b to a","Raises error if a≠b","Compares without error"],ok:1}},

  {id:"estruturas",ch:"Cap. 22",chEn:"Ch. 22",icon:"ti-sitemap",portrait:{ic:"ti-binary-tree",cl:"#EF9F27",nm:"Arquiteto das Estruturas",nmEn:"Structures Architect"},mapPos:{x:70,y:88},
   item:{icon:"ti-sitemap",name:"Esquema das Estruturas",nameEn:"Structures Blueprint"},
   narr:`O Labirinto das Estruturas. O arquiteto pergunta:\n\n— Você tem uma fila de mensagens. Primeiro a entrar, primeiro a sair. Pilha ou fila?`,
   narrH:`FIFO (primeiro a entrar, primeiro a sair). Qual estrutura usar?`,
   narrEn:`The Structures Labyrinth. The architect asks:\n\n— You have a message queue. First in, first out. Stack or queue?`,
   narrHEn:`FIFO (first in, first out). Which structure to use?`,
   hint:"Fila = FIFO (primeiro a entrar sai primeiro). Pilha = LIFO (último a entrar sai primeiro).",
   hintEn:"Queue = FIFO (first in, first out). Stack = LIFO (last in, first out).",
   concept:{nm:"Estruturas de Dados",nmEn:"Data Structures",cl:"#EF9F27",bg:"rgba(239,159,39,.07)",bd:"rgba(239,159,39,.22)",
    sum:"Estruturas de dados organizam informação com propósitos específicos: pilha (LIFO), fila (FIFO), árvore (hierarquia), hash (acesso O(1)).",
    sumEn:"Data structures organize information for specific purposes: stack (LIFO), queue (FIFO), tree (hierarchy), hash (O(1) access).",
    py:`from collections import deque\n\n# Fila (FIFO)\nfila = deque()\nfila.append("msg1")\nfila.append("msg2")\nprint(fila.popleft())  # "msg1"\n\n# Pilha (LIFO)\npilha = []\npilha.append(1)\npilha.append(2)\nprint(pilha.pop())  # 2\n\n# Dict = hash table O(1)\ncache = {}\ncache["user_1"] = {"nome": "Byte"}`,
    js:`// Queue (FIFO)\nconst queue = [];\nqueue.push("msg1");\nqueue.push("msg2");\nconsole.log(queue.shift()); // "msg1"\n\n// Stack (LIFO)\nconst stack = [];\nstack.push(1);\nstack.push(2);\nconsole.log(stack.pop()); // 2\n\n// Map = hash table O(1)\nconst cache = new Map();\ncache.set("user_1", {name: "Byte"});`},
   choices:[
    {text:"Fila (deque) — FIFO, primeira mensagem sai primeiro",textEn:"Queue (deque) — FIFO, first message leaves first",good:true,
     cons:`As mensagens processam na ordem correta!\n\n— FIFO = Fila de banco. LIFO = Ctrl+Z (desfazer). Cada estrutura tem seu uso ideal.`,
     consEn:`Messages process in the correct order!\n\n— FIFO = Bank queue. LIFO = Ctrl+Z (undo). Each structure has its ideal use.`},
    {text:"Pilha (lista) — LIFO, última mensagem sai primeiro",textEn:"Stack (list) — LIFO, last message leaves first",good:false,
     cons:`A última mensagem sai primeiro — as mais antigas ficam presas!\n\n— Para fila de mensagens, FIFO é essencial.`,
     consEn:`The last message leaves first — older ones get stuck!\n\n— For message queues, FIFO is essential.`,
     branch:`— deque.popleft() = FIFO. list.pop() = LIFO. Escolha certa muda tudo.`,
     branchEn:`— deque.popleft() = FIFO. list.pop() = LIFO. Right choice changes everything.`}],
   quiz:{q:"Qual estrutura usa LIFO?",qEn:"Which structure uses LIFO?",opts:["Fila","Pilha","Hash"],optsEn:["Queue","Stack","Hash"],ok:1}},
];
const UI={
  pt:{lang:"pt",langLabel:"🇧🇷 Português",subtitle:"Uma aventura de programação",
   chapters:"22 capítulos · torneio · trilha de carreira · modo infinito · boss fights · e muito mais",
   playSolo:"Jogar solo →",playMulti:"Multiplayer →",playDaily:"Desafio diário →",playTournament:"Torneio →",playInfinite:"Modo infinito",dailyToday:"Desafio de hoje:",
   settingTheme:"Tema visual",settingDiff:"Dificuldade",settingCode:"Linguagem",settingUILang:"Idioma",settingPlayer:"Nome",settingCareer:"Trilha de carreira",
   diffInit:"Iniciante",diffHard:"Desafiador",langPy:"Python",langJs:"JavaScript",langBoth:"Ambas",
   careerAll:"Todos",careerFront:"Frontend",careerBack:"Backend",careerData:"Data Science",
   welcomeSubtitle:"Uma aventura de programação interativa",welcomeStart:"Começar aventura →",welcomeFirst:"Sua primeira visita!",
   chapterPickTitle:"Escolher capítulo",chapterPickHint:"Clique para ir direto ao capítulo",chapterLocked:"Bloqueado",
   tournamentTitle:"Modo Torneio",tournamentDesc:"5 capítulos aleatórios · tempo reduzido · pontuação dobrada. O desafio dos campeões!",tournamentStart:"Iniciar torneio →",tournamentEnd:"Torneio concluído!",tournamentScore:"Pontuação:",tournamentWin:"Novo recorde de torneio!",
   infiniteTitle:"Modo Infinito",infiniteDesc:"Você dominou todos os capítulos! Continue acumulando XP e streak no modo infinito.",infiniteStart:"Entrar no modo infinito →",infiniteLabel:"∞",
   streakRewardTitle:"Recompensa de streak!",streakRewardDays:"dias consecutivos",streakRewardBonus:"XP bônus:",streakRewardClaim:"Resgatar recompensa →",
   bonusQuizTitle:"Quiz bônus (opcional)",bonusQuizSkip:"Pular →",bonusQuizPoints:"+5 pts por acerto, sem penalidade",bonusQuizClaim:"Pegar bônus →",bonusQuizNext:"Próximo capítulo →",
   glossarySearch:"Buscar conceito...",
   certificateTitle:"Certificado de Conclusão",certificateDl:"Baixar certificado (.html)",certificateShare:"Compartilhar",certificateOracle:"Grande Oráculo do Código",
   sessionTitle:"Histórico de sessões",sessionEmpty:"Nenhuma sessão registrada ainda.",sessionClose:"Fechar →",sessionBest:"melhor",
   friendTitle:"Comparar com amigo",friendLink:"Link gerado:",friendCopy:"Copiar link",friendCopied:"Copiado!",friendView:"Ver comparação",friendClose:"Fechar",
   friendCompareTitle:"Comparação de resultados",
   multiTitle:"Modo Multiplayer",multiDesc:"Dois jogadores, mesmo dispositivo. Maior pontuação vence!",
   player1:"Jogador 1",player2:"Jogador 2",startMulti:"Iniciar →",
   switchTitle:"Fim do turno",switchScore:"Pontuação:",switchPass:"Passe para",switchBtn:"Turno de",
   hintBtn:"Dica",hintFree:"grátis",hintCost:"-{n} pts",hintL1:"Conceito geral",hintL2:"Exemplo",hintL3:"Resposta direta",whatDo:"O que você faz?",
   goodChoice:"Boa escolha! +10 pts",badChoice:"Poderia ser melhor",
   conceptLearned:"Conceito aprendido",editCode:"Edite o código para praticar!",resetCode:"Resetar",
   animTab:"Animação",codeTab:"Código",sandboxTitle:"Sandbox — Execute código real",sandboxRun:"Executar",sandboxRunning:"Executando...",sandboxHint:"Modifique e execute!",sandboxNoOut:"(sem output — sem",skulptLoading:"carregando Skulpt...",
   bugTitle:"🐛 Corrija o Bug",bugHint:"Dica:",bugRun:"Testar",bugRunning:"Testando...",bugExpected:"Esperado:",bugGot:"Sua saída:",bugPass:"Bug corrigido! +15 pts 🎉",bugFail:"Ainda tem bug — tente novamente!",bugSkip:"Pular →",
   animPrev:"◀",animNext:"▶",animVars:"Variáveis",animOut:"Saída",animStep:"Passo",animOf:"de",animNoAnim:"Sem animação para este conceito.",
   quizTitle:"Quiz rápido",quizCheck:"Verificar →",quizRight:"+5 pontos! Correto!",quizWrong:"Não desta vez!",quizNextCh:"Próximo capítulo →",quizFinal:"Ver resultado final →",
   sandboxNext:"Sandbox →",conceptNext:"Próximo: Sandbox →",continueBtn:"Continuar →",conceptBtn:"Ver conceito →",branchTag:"Desvio narrativo",
   bossIntro:"MINI-BOSS",bossQ:"Pergunta",bossOf:"de",bossCorrect:"Correto! +",bossWrong:"Errou!",bossWin:"Boss derrotado!",bossBonusXP:"XP bônus:",bossNext:"Próximo capítulo →",bossTime:"Tempo:",bossSkip:"Pular boss",
   mapTitle:"Mapa do Reino do Código",mapKingdom:"Reino do Código",mapHint:"Clique em um capítulo para revisitá-lo",
   achTitle:"Conquistas",achDone:"Desbloqueado",lbTitle:"Placar de Líderes",lbEmpty:"Nenhuma partida ainda!",
   profileTitle:"Perfil de Desenvolvedor",profileScore:"Pontuação",profilePct:"Aproveitamento",profileAch:"Conquistas",
   profileConcepts:"Conceitos dominados",profileInv:"Inventário",profileDl:"Baixar cartão (.txt)",profileShare:"Compartilhar card",profileAvatar:"Gerar avatar IA",profileAvatarLoading:"Gerando...",
   reviewTitle:"Revisão de Erros",reviewEmpty:"Nenhum erro! Impecável!",reviewClose:"Fechar →",reviewQ:"Pergunta:",reviewCorrect:"Resposta correta:",
   xpLabel:"XP",xpLevel:"Nível",xpNext:"próximo",streakLabel:"streak",streakDays:"dias",
   endTitle:"Missão cumprida!",endReplay:"Jogar novamente",endMap:"Revisar mapa",endCheat:"Cheatsheet",endProfile:"Perfil",endLB:"Placar",endReview:"Revisar erros",endCert:"Certificado",endInfinite:"Modo infinito",
   endContinue:"Continue sua jornada aprendendo mais sobre programação!",
   endMultiWin:"— Você venceu! 🏆",endMultiLose:"— Vitória deles!",endMultiDraw:"— Empate!",
   back:"Voltar",pts:"pts",speed:"Contrarrelógio",time:"Tempo",musicOn:"♪",musicOff:"♪",
   grimoire:"Grimório",grimoireConcepts:"conceitos",grimoireEmpty:"Conclua capítulos para ver conceitos aqui.",
   ranks:["Arquimago do Código","Desenvolvedor Sênior","Desenvolvedor Júnior","Aprendiz Promissor"],
   cardTitle:"TERRAS DO CÓDIGO — Cartão de Desenvolvedor",cardName:"Nome:",cardRank:"Rank:",cardScore:"Pontuação:",cardMode:"Modo:",cardConcepts:"Conceitos:",cardAch:"Conquistas:",cardDate:"Data:",
   cheatTitle:"TERRAS DO CÓDIGO — Cheatsheet de Programação",
   ach:[
    {nm:"Primeiro Passo",desc:"Primeira boa escolha"},{nm:"Sem Bengala",desc:"Capítulo sem dicas"},
    {nm:"Mente Afiada",desc:"3 quizzes seguidos"},{nm:"Relâmpago",desc:"Capítulo em <25s"},
    {nm:"Poliglota",desc:"Viu Python e JS"},{nm:"Mão na Massa",desc:"Executou código real"},
    {nm:"Colecionador",desc:"6+ itens coletados"},{nm:"Impecável",desc:"Zero erros"},
    {nm:"Disciplinado",desc:"Desafio diário"},{nm:"Competidor",desc:"Modo multiplayer"},
    {nm:"Caçador de Bosses",desc:"Derrotou um mini-boss"},{nm:"Exterminador de Bugs",desc:"Corrigiu um bug"},
    {nm:"7 Dias Seguidos",desc:"Streak de 7 dias"},{nm:"Nível 10",desc:"Atingiu nível 10"},
    {nm:"Completou Tudo",desc:"Todos os 22 capítulos"},{nm:"Campeão do Torneio",desc:"Completou torneio"},
    {nm:"Infinito",desc:"Entrou no modo infinito"},
   ],
  },
  en:{lang:"en",langLabel:"🇺🇸 English",subtitle:"A programming adventure",
   chapters:"22 chapters · tournament · career path · infinite mode · boss fights · and much more",
   playSolo:"Play solo →",playMulti:"Multiplayer →",playDaily:"Daily challenge →",playTournament:"Tournament →",playInfinite:"Infinite mode",dailyToday:"Today's challenge:",
   settingTheme:"Theme",settingDiff:"Difficulty",settingCode:"Code language",settingUILang:"Language",settingPlayer:"Name",settingCareer:"Career path",
   diffInit:"Beginner",diffHard:"Challenging",langPy:"Python",langJs:"JavaScript",langBoth:"Both",
   careerAll:"All",careerFront:"Frontend",careerBack:"Backend",careerData:"Data Science",
   welcomeSubtitle:"An interactive programming adventure",welcomeStart:"Start adventure →",welcomeFirst:"Your first visit!",
   chapterPickTitle:"Choose chapter",chapterPickHint:"Click to jump to a chapter",chapterLocked:"Locked",
   tournamentTitle:"Tournament Mode",tournamentDesc:"5 random chapters · reduced time · double score. The champions' challenge!",tournamentStart:"Start tournament →",tournamentEnd:"Tournament complete!",tournamentScore:"Score:",tournamentWin:"New tournament record!",
   infiniteTitle:"Infinite Mode",infiniteDesc:"You've mastered all chapters! Keep accumulating XP and streak in infinite mode.",infiniteStart:"Enter infinite mode →",infiniteLabel:"∞",
   streakRewardTitle:"Streak reward!",streakRewardDays:"days in a row",streakRewardBonus:"Bonus XP:",streakRewardClaim:"Claim reward →",
   bonusQuizTitle:"Bonus quiz (optional)",bonusQuizSkip:"Skip →",bonusQuizPoints:"+5 pts per correct, no penalty",bonusQuizClaim:"Get bonus →",bonusQuizNext:"Next chapter →",
   glossarySearch:"Search concept...",
   certificateTitle:"Certificate of Completion",certificateDl:"Download certificate (.html)",certificateShare:"Share",certificateOracle:"The Great Code Oracle",
   sessionTitle:"Session history",sessionEmpty:"No sessions recorded yet.",sessionClose:"Close →",sessionBest:"best",
   friendTitle:"Compare with friend",friendLink:"Link generated:",friendCopy:"Copy link",friendCopied:"Copied!",friendView:"View comparison",friendClose:"Close",
   friendCompareTitle:"Results comparison",
   multiTitle:"Multiplayer Mode",multiDesc:"Two players, same device. Highest score wins!",
   player1:"Player 1",player2:"Player 2",startMulti:"Start →",
   switchTitle:"Turn over",switchScore:"Score:",switchPass:"Pass to",switchBtn:"Turn for",
   hintBtn:"Hint",hintFree:"free",hintCost:"-{n} pts",hintL1:"General concept",hintL2:"Example",hintL3:"Direct answer",whatDo:"What do you do?",
   goodChoice:"Good choice! +10 pts",badChoice:"Could be better",
   conceptLearned:"Concept learned",editCode:"Edit the code to practice!",resetCode:"Reset",
   animTab:"Animation",codeTab:"Code",sandboxTitle:"Sandbox — Run real code",sandboxRun:"Run",sandboxRunning:"Running...",sandboxHint:"Modify and run freely!",sandboxNoOut:"(no output — no",skulptLoading:"loading Skulpt...",
   bugTitle:"🐛 Fix the Bug",bugHint:"Hint:",bugRun:"Test",bugRunning:"Testing...",bugExpected:"Expected:",bugGot:"Your output:",bugPass:"Bug fixed! +15 pts 🎉",bugFail:"Still buggy — keep trying!",bugSkip:"Skip →",
   animPrev:"◀",animNext:"▶",animVars:"Variables",animOut:"Output",animStep:"Step",animOf:"of",animNoAnim:"No animation for this concept.",
   quizTitle:"Quick quiz",quizCheck:"Check →",quizRight:"+5 points! Correct!",quizWrong:"Not this time!",quizNextCh:"Next chapter →",quizFinal:"See final result →",
   sandboxNext:"Sandbox →",conceptNext:"Next: Sandbox →",continueBtn:"Continue →",conceptBtn:"See concept →",branchTag:"Narrative branch",
   bossIntro:"MINI-BOSS",bossQ:"Question",bossOf:"of",bossCorrect:"Correct! +",bossWrong:"Wrong!",bossWin:"Boss defeated!",bossBonusXP:"Bonus XP:",bossNext:"Next chapter →",bossTime:"Time:",bossSkip:"Skip boss",
   mapTitle:"Map of the Code Kingdom",mapKingdom:"Code Kingdom",mapHint:"Click a chapter to revisit it",
   achTitle:"Achievements",achDone:"Unlocked",lbTitle:"Leaderboard",lbEmpty:"No matches yet!",
   profileTitle:"Developer Profile",profileScore:"Score",profilePct:"Performance",profileAch:"Achievements",
   profileConcepts:"Mastered concepts",profileInv:"Inventory",profileDl:"Download card (.txt)",profileShare:"Share card",profileAvatar:"Generate AI avatar",profileAvatarLoading:"Generating...",
   reviewTitle:"Error Review",reviewEmpty:"No errors! Flawless!",reviewClose:"Close →",reviewQ:"Question:",reviewCorrect:"Correct answer:",
   xpLabel:"XP",xpLevel:"Level",xpNext:"next",streakLabel:"streak",streakDays:"days",
   endTitle:"Mission accomplished!",endReplay:"Play again",endMap:"Review map",endCheat:"Cheatsheet",endProfile:"Profile",endLB:"Leaderboard",endReview:"Review errors",endCert:"Certificate",endInfinite:"Infinite mode",
   endContinue:"Continue your journey learning more about programming!",
   endMultiWin:"— You won! 🏆",endMultiLose:"— They won!",endMultiDraw:"— It's a tie!",
   back:"Back",pts:"pts",speed:"Speed Run",time:"Time",musicOn:"♪",musicOff:"♪",
   grimoire:"Grimoire",grimoireConcepts:"concepts",grimoireEmpty:"Complete chapters to see concepts here.",
   ranks:["Code Archmage","Senior Developer","Junior Developer","Promising Apprentice"],
   cardTitle:"LANDS OF CODE — Developer Card",cardName:"Name:",cardRank:"Rank:",cardScore:"Score:",cardMode:"Mode:",cardConcepts:"Concepts:",cardAch:"Achievements:",cardDate:"Date:",
   cheatTitle:"LANDS OF CODE — Programming Cheatsheet",
   ach:[
    {nm:"First Step",desc:"First good choice"},{nm:"No Crutches",desc:"Chapter without hints"},
    {nm:"Sharp Mind",desc:"3 quizzes in a row"},{nm:"Lightning",desc:"Chapter in <25s"},
    {nm:"Polyglot",desc:"Saw Python and JS"},{nm:"Hands On",desc:"Ran real code"},
    {nm:"Collector",desc:"6+ items collected"},{nm:"Flawless",desc:"Zero errors"},
    {nm:"Disciplined",desc:"Daily challenge"},{nm:"Competitor",desc:"Multiplayer mode"},
    {nm:"Boss Slayer",desc:"Defeated a mini-boss"},{nm:"Bug Exterminator",desc:"Fixed a bug"},
    {nm:"7-Day Streak",desc:"7 day streak"},{nm:"Level 10",desc:"Reached level 10"},
    {nm:"Completed All",desc:"All 22 chapters"},{nm:"Tournament Champ",desc:"Completed tournament"},
    {nm:"Infinite",desc:"Entered infinite mode"},
   ],
  },
};

// ── UTILITY ─────────────────────────────────────────────────
function NBtn({children,onClick,disabled,T}){const[h,sh]=useState(false);return(<button onClick={onClick} disabled={disabled} onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)} style={{background:"transparent",border:`0.5px solid ${disabled?T.ab:T.am}`,color:disabled?T.mt:T.am,padding:"0.6rem 1.4rem",fontSize:"0.88rem",fontFamily:"Georgia,serif",cursor:disabled?"default":"pointer",borderRadius:"6px",opacity:h&&!disabled?1:0.85,transition:"opacity 0.2s"}}>{children}</button>);}
function CBtn({children,onClick,T}){const[h,sh]=useState(false);return(<button onClick={onClick} onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)} style={{background:h?T.al:"transparent",border:`0.5px solid ${h?T.am:T.ab}`,color:T.tx,padding:"0.85rem 1.1rem",textAlign:"left",cursor:"pointer",borderRadius:"8px",fontSize:"0.92rem",fontFamily:"Georgia,serif",lineHeight:1.5,width:"100%",transition:"all 0.18s"}}><i className="ti ti-arrow-right" style={{fontSize:13,marginRight:8,color:T.am,verticalAlign:"-1px"}} aria-hidden="true"/>{children}</button>);}
function ProgBar({idx,total,T}){return(<div style={{display:"flex",gap:4,marginBottom:"1.5rem"}}>{Array.from({length:total},(_,i)=>(<div key={i} style={{flex:1,height:3,borderRadius:99,background:i<idx?T.am:i===idx?"rgba(239,159,39,0.4)":"rgba(239,159,39,0.12)",transition:"background 0.5s"}}/>))}</div>);}
function Portrait({p,lang,T}){const nm=lang==="en"?(p.nmEn||p.nm):p.nm;return(<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1rem"}}><div style={{width:36,height:36,borderRadius:"50%",background:"rgba(127,119,221,0.15)",border:`0.5px solid ${T.ab}`,display:"flex",alignItems:"center",justifyContent:"center"}}><i className={`ti ${p.ic}`} style={{fontSize:16,color:p.cl}} aria-hidden="true"/></div><span style={{fontSize:12,color:T.mt,fontFamily:"Georgia,serif",fontStyle:"italic"}}>{nm}</span></div>);}
function AchToast({ach,T,onClose}){useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t);},[]);return(<div style={{position:"fixed",top:20,right:20,zIndex:999,background:T.sf,border:`0.5px solid ${T.am}`,borderRadius:8,padding:"0.75rem 1rem",maxWidth:240}}><div style={{display:"flex",alignItems:"center",gap:8}}><i className={`ti ${ach.icon}`} style={{fontSize:18,color:T.am}} aria-hidden="true"/><div><div style={{fontSize:12,color:T.am,fontWeight:500}}>{ach.nm}</div><div style={{fontSize:11,color:T.mt}}>{ach.desc}</div></div></div></div>);}
function TimerBar({secs,max,T,L}){const pct=Math.round((secs/max)*100);const cl=secs<10?T.cr:secs<20?T.am:T.gn;return(<div style={{marginBottom:"0.75rem"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:cl}}><i className="ti ti-clock" style={{fontSize:11,marginRight:4}} aria-hidden="true"/>{L.time}</span><span style={{fontSize:13,fontWeight:500,color:cl}}>{secs}s</span></div><div style={{height:4,background:T.al,borderRadius:99,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:cl,transition:"width 1s linear",borderRadius:99}}/></div></div>);}
function XPBar({xpData,lang,T,L}){const{lvl,pct,xp,next}=xpData;const title=lang==="en"?xpData.enTi:xpData.ptTi;return(<div style={{marginBottom:"0.75rem"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:T.am}}><i className="ti ti-trending-up" style={{fontSize:11,marginRight:4}} aria-hidden="true"/>{L.xpLevel} {lvl} — {title}</span><span style={{fontSize:10,color:T.mt}}>{xp}{next?`/${next.xp}`:""} {L.xpLabel}</span></div><div style={{height:3,background:T.al,borderRadius:99,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:T.am,borderRadius:99,transition:"width 0.8s ease"}}/></div></div>);}
function StreakBadge({streak,T,L}){if(!streak||streak<2)return null;return(<span style={{fontSize:10,background:"rgba(216,90,48,.12)",border:"0.5px solid rgba(216,90,48,.35)",color:T.cr,padding:"2px 8px",borderRadius:4,display:"inline-flex",alignItems:"center",gap:4}}><i className="ti ti-flame" style={{fontSize:11}} aria-hidden="true"/>{streak} {L.streakDays}</span>);}

// ── PARTICLES ────────────────────────────────────────────────
function Particles({particles,T}){return(<>{particles.map(p=>(<div key={p.id} style={{position:"fixed",left:p.x,top:p.y,pointerEvents:"none",zIndex:998,animation:"particleUp 0.8s ease-out forwards"}}><div style={{width:6,height:6,borderRadius:"50%",background:T.am,transform:`rotate(${p.angle}deg)`,opacity:0.9}}/></div>))}</>);}

// ── AMBIENT MUSIC ────────────────────────────────────────────
function useAmbientMusic(enabled,isBoss){
  const ctxRef=useRef(null);const nodesRef=useRef([]);const timeoutRef=useRef(null);
  const stop=useCallback(()=>{nodesRef.current.forEach(n=>{try{n.stop();}catch{}});nodesRef.current=[];if(timeoutRef.current)clearTimeout(timeoutRef.current);},[]);
  const play=useCallback(()=>{
    if(!enabled)return;
    try{
      if(!ctxRef.current)ctxRef.current=new(window.AudioContext||window.webkitAudioContext)();
      const ctx=ctxRef.current;if(ctx.state==="suspended")ctx.resume();
      stop();
      const freqs=isBoss?[110,147,165,196]:[220,277,330,392];
      freqs.forEach((f,i)=>{
        const o=ctx.createOscillator(),g=ctx.createGain();
        o.connect(g);g.connect(ctx.destination);
        o.type="sine";o.frequency.value=f;
        g.gain.setValueAtTime(0,ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.02,ctx.currentTime+2);
        o.start();nodesRef.current.push(o);
        setTimeout(()=>{try{g.gain.linearRampToValueAtTime(0,ctx.currentTime+1);}catch{}},8000-(i*500));
      });
      timeoutRef.current=setTimeout(play,8500);
    }catch{}
  },[enabled,isBoss,stop]);
  useEffect(()=>{if(enabled)play();else stop();return stop;},[enabled,isBoss]);
  return{play,stop};
}

// ── WELCOME SCREEN ────────────────────────────────────────────
function WelcomeScreen({lang,T,L,onStart}){
  const[typed,setTyped]=useState("");const[phase,setPhase]=useState(0);
  const title=lang==="en"?"Lands of Code":"Terras do Código";
  useEffect(()=>{
    let i=0;const iv=setInterval(()=>{i++;setTyped(title.slice(0,i));if(i>=title.length){clearInterval(iv);setTimeout(()=>setPhase(1),400);}},60);
    return()=>clearInterval(iv);
  },[]);
  const icons=["ti-variable","ti-git-branch","ti-refresh","ti-code","ti-database","ti-test-pipe"];
  return(<div style={{textAlign:"center",padding:"3rem 2rem"}}>
    <i className="ti ti-sword" style={{fontSize:48,color:T.am,display:"block",marginBottom:"1.5rem"}} aria-hidden="true"/>
    <p style={{fontSize:10,letterSpacing:4,color:T.am,textTransform:"uppercase",marginBottom:"0.75rem"}}>{L.subtitle}</p>
    <h1 style={{fontSize:"2.4rem",fontWeight:"normal",color:T.tx,fontFamily:"Georgia,serif",marginBottom:"0.5rem",minHeight:"3rem",letterSpacing:"2px"}}>{typed}<span style={{animation:"blink 1s infinite",color:T.am}}>|</span></h1>
    <p style={{fontSize:13,color:T.mt,marginBottom:"2rem",fontFamily:"Georgia,serif"}}>{L.welcomeSubtitle}</p>
    {phase>=1&&<div style={{display:"flex",justifyContent:"center",gap:16,marginBottom:"2rem",animation:"fadeIn 0.6s ease"}}>
      {icons.map((ic,i)=>(<div key={i} style={{width:40,height:40,borderRadius:"50%",background:T.al,border:`0.5px solid ${T.ab}`,display:"flex",alignItems:"center",justifyContent:"center",animation:`fadeIn 0.3s ${i*0.1}s ease both`}}><i className={`ti ${ic}`} style={{fontSize:18,color:T.am}} aria-hidden="true"/></div>))}
    </div>}
    {phase>=1&&<NBtn onClick={onStart} T={T}>{L.welcomeStart}</NBtn>}
    <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
  </div>);}

// ── CAREER SELECTOR ───────────────────────────────────────────
function CareerSelector({settings,setSettings,T,L,onDone}){
  const paths=[
    {key:"all",icon:"ti-books",ptLabel:L.careerAll,enLabel:L.careerAll,count:22},
    {key:"frontend",icon:"ti-palette",ptLabel:L.careerFront,enLabel:L.careerFront,count:CAREER_PATHS.frontend.indices.length},
    {key:"backend",icon:"ti-server",ptLabel:L.careerBack,enLabel:L.careerBack,count:CAREER_PATHS.backend.indices.length},
    {key:"data",icon:"ti-chart-dots",ptLabel:L.careerData,enLabel:L.careerData,count:CAREER_PATHS.data.indices.length},
  ];
  return(<div>
    <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.75rem"}}>{L.settingCareer}</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:"1rem"}}>
      {paths.map(p=>{const sel=settings.career===p.key;return(<button key={p.key} onClick={()=>setSettings(s=>({...s,career:p.key}))} style={{background:sel?T.al:"transparent",border:`0.5px solid ${sel?T.am:T.ab}`,borderRadius:8,padding:"0.75rem",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}>
        <i className={`ti ${p.icon}`} style={{fontSize:20,color:sel?T.am:T.mt,display:"block",marginBottom:6}} aria-hidden="true"/>
        <div style={{fontSize:13,fontWeight:500,color:sel?T.am:T.tx,fontFamily:"Georgia,serif"}}>{L.lang==="en"?p.enLabel:p.ptLabel}</div>
        <div style={{fontSize:10,color:T.mt}}>{p.count} capítulos</div>
      </button>);})}
    </div>
  </div>);}

// ── CHAPTER PICKER ────────────────────────────────────────────
function ChapterPicker({scenes,inventory,T,L,lang,onPick,onBack}){
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}>
      <button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button>
      <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.chapterPickTitle}</p>
    </div>
    <p style={{fontSize:12,color:T.mt,marginBottom:"1rem",fontFamily:"Georgia,serif"}}>{L.chapterPickHint}</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:8}}>
      {scenes.map((sc,i)=>{
        const done=inventory.find(s=>s.id===sc.id);
        const ch=lang==="en"?(sc.chEn||sc.ch):sc.ch;
        const title=lang==="en"?(sc.titleEn||sc.title||""):sc.title||"";
        return(<button key={sc.id} onClick={()=>onPick(i)} style={{background:done?T.al:T.sf,border:`0.5px solid ${done?T.am:T.ab}`,borderRadius:8,padding:"0.75rem 0.5rem",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
          <i className={`ti ${sc.icon}`} style={{fontSize:18,color:done?T.am:T.mt,display:"block",marginBottom:5}} aria-hidden="true"/>
          <div style={{fontSize:10,color:T.am,marginBottom:2}}>{ch}</div>
          <div style={{fontSize:11,color:T.tx,lineHeight:1.3}}>{title.length>20?title.slice(0,18)+"…":title}</div>
          {done&&<i className="ti ti-check" style={{fontSize:10,color:T.gn,marginTop:4,display:"block"}} aria-hidden="true"/>}
        </button>);})}
    </div>
  </div>);}

// ── BONUS QUIZ ────────────────────────────────────────────────
function BonusQuiz({sceneId,lang,T,L,addScore,onDone}){
  const qs=BONUS_QUIZ[sceneId]||[];const[idx,setIdx]=useState(0);const[sel,setSel]=useState(null);const[rev,setRev]=useState(false);const[earned,setEarned]=useState(0);
  if(!qs.length)return(<div><p style={{fontSize:13,color:T.mt,fontFamily:"Georgia,serif",marginBottom:"1rem"}}>Sem perguntas bônus para este capítulo.</p><NBtn onClick={onDone} T={T}>{L.bonusQuizNext}</NBtn></div>);
  if(idx>=qs.length)return(<div style={{textAlign:"center",paddingTop:"1rem"}}><i className="ti ti-gift" style={{fontSize:36,color:T.am,display:"block",marginBottom:"0.75rem"}} aria-hidden="true"/><p style={{fontSize:13,color:T.am,marginBottom:"1rem",fontFamily:"Georgia,serif"}}>+{earned} pts bônus!</p><NBtn onClick={onDone} T={T}>{L.bonusQuizNext}</NBtn></div>);
  const q=qs[idx];const question=lang==="en"?(q.qEn||q.q):q.q;const opts=lang==="en"?(q.optsEn||q.opts):q.opts;const ok=sel===q.ok;
  return(<div>
    <p style={{fontSize:10,letterSpacing:3,color:T.gn,textTransform:"uppercase",marginBottom:"0.5rem"}}><i className="ti ti-gift" style={{fontSize:13,marginRight:6,verticalAlign:"-1px"}} aria-hidden="true"/>{L.bonusQuizTitle} — {idx+1}/{qs.length}</p>
    <p style={{fontSize:11,color:T.mt,marginBottom:"0.75rem",fontFamily:"Georgia,serif"}}>{L.bonusQuizPoints}</p>
    <p style={{fontSize:"0.96rem",color:T.tx,marginBottom:"1.25rem",fontFamily:"Georgia,serif",lineHeight:1.7}}>{question}</p>
    <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",marginBottom:"1rem"}}>{opts.map((opt,i)=>{let bd=T.ab,bg="transparent",tc=T.tx;if(rev){if(i===q.ok){bd="rgba(93,202,165,.5)";bg="rgba(93,202,165,.08)";tc=T.gn;}else if(i===sel){bd="rgba(216,90,48,.5)";bg="rgba(216,90,48,.08)";tc=T.cr;}}else if(i===sel){bd=T.am;bg=T.al;}return(<button key={i} onClick={()=>!rev&&setSel(i)} style={{background:bg,border:`0.5px solid ${bd}`,color:tc,padding:"0.75rem 1rem",textAlign:"left",cursor:rev?"default":"pointer",borderRadius:8,fontSize:"0.9rem",fontFamily:"Georgia,serif",lineHeight:1.5}}>{opt}</button>);})}</div>
    {!rev?(<NBtn onClick={()=>sel!==null&&setRev(true)} disabled={sel===null} T={T}>{L.quizCheck}</NBtn>):(<div><p style={{fontSize:13,color:ok?T.gn:T.mt,marginBottom:"1rem",fontFamily:"Georgia,serif"}}>{ok?"+5 pts!":L.quizWrong}</p><NBtn onClick={()=>{if(ok){addScore(5);setEarned(e=>e+5);}setSel(null);setRev(false);setIdx(i=>i+1);}} T={T}>{idx<qs.length-1?L.quizCheck:L.bonusQuizNext}</NBtn></div>)}
  </div>);}

// ── STREAK REWARD ──────────────────────────────────────────────
function StreakRewardScreen({reward,lang,T,L,addXP,onClaim}){
  const{days,xp}=reward;
  useEffect(()=>{addXP(xp);},[]);
  return(<div style={{textAlign:"center",padding:"2rem 1rem"}}>
    <i className="ti ti-flame" style={{fontSize:52,color:T.cr,display:"block",marginBottom:"1rem"}} aria-hidden="true"/>
    <p style={{fontSize:10,letterSpacing:3,color:T.cr,textTransform:"uppercase",marginBottom:"0.5rem"}}>{L.streakRewardTitle}</p>
    <h2 style={{fontSize:"2rem",fontWeight:"normal",color:T.tx,marginBottom:"0.5rem",fontFamily:"Georgia,serif"}}>{days} {L.streakRewardDays}</h2>
    <p style={{fontSize:"1.1rem",color:T.am,marginBottom:"1.5rem",fontFamily:"Georgia,serif"}}>{L.streakRewardBonus} +{xp} XP</p>
    <NBtn onClick={onClaim} T={T}>{L.streakRewardClaim}</NBtn>
  </div>);}

// ── CERTIFICATE ───────────────────────────────────────────────
function CertificateScreen({name,rank,score,learned,unlocked,lang,T,L,onBack}){
  const today=new Date().toLocaleDateString(lang==="en"?"en-US":"pt-BR",{year:"numeric",month:"long",day:"numeric"});
  const concepts=learned.map(c=>lang==="en"?(c.nmEn||c.nm):c.nm);
  const html=`<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8"><title>${L.certificateTitle}</title><style>body{font-family:Georgia,serif;background:#1a1810;color:#e0d4b4;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:2rem;box-sizing:border-box}.cert{background:#22201a;border:2px solid #EF9F27;border-radius:16px;padding:3rem;max-width:680px;width:100%;text-align:center}.top-border{height:4px;background:linear-gradient(90deg,#EF9F27,#D85A30,#EF9F27);border-radius:4px;margin-bottom:2rem}.icon{font-size:3rem;margin-bottom:1rem}.subtitle{font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#EF9F27;margin-bottom:0.5rem}.title{font-size:2rem;font-weight:normal;margin-bottom:0.5rem}.name{font-size:1.5rem;color:#EF9F27;margin:1.5rem 0;border-bottom:0.5px solid rgba(239,159,39,.3);border-top:0.5px solid rgba(239,159,39,.3);padding:0.75rem 0}.body{font-size:0.9rem;line-height:1.8;color:rgba(224,212,180,.7);margin-bottom:1.5rem}.concepts{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:1rem 0}.tag{font-size:11px;background:rgba(239,159,39,.1);border:0.5px solid rgba(239,159,39,.3);color:#EF9F27;padding:3px 12px;border-radius:4px}.footer{display:flex;justify-content:space-between;align-items:flex-end;margin-top:2rem;font-size:11px;color:rgba(224,212,180,.4)}.score{font-size:1.2rem;color:#EF9F27}</style></head><body><div class="cert"><div class="top-border"></div><div class="icon">⚔️</div><p class="subtitle">${lang==="en"?"Certificate of Completion":"Certificado de Conclusão"}</p><h1 class="title">${lang==="en"?"Lands of Code":"Terras do Código"}</h1><div class="name">${name||"Byte"}</div><p class="body">${lang==="en"?`This certifies that the above has successfully completed all 22 chapters of Lands of Code, demonstrating mastery of fundamental and advanced programming concepts.`:`Certificamos que o acima identificado concluiu com êxito todos os 22 capítulos das Terras do Código, demonstrando domínio de conceitos de programação fundamentais e avançados.`}</p><p class="score">${rank} · ${score} ${L.pts}</p><div class="concepts">${concepts.map(c=>`<span class="tag">${c}</span>`).join("")}</div><div class="footer"><div>${L.certificateOracle}</div><div>${today}</div></div></div></body></html>`;
  const dl=()=>{const b=new Blob([html],{type:"text/html"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="certificado-terras-do-codigo.html";a.click();};
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}>
      <button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button>
      <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.certificateTitle}</p>
    </div>
    <div style={{background:T.sf,border:`2px solid ${T.am}`,borderRadius:12,padding:"2rem",marginBottom:"1rem",textAlign:"center"}}>
      <div style={{height:3,background:`linear-gradient(90deg,${T.am},${T.cr},${T.am})`,borderRadius:4,marginBottom:"1.5rem"}}/>
      <i className="ti ti-award" style={{fontSize:40,color:T.am,display:"block",marginBottom:"0.75rem"}} aria-hidden="true"/>
      <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.4rem"}}>{lang==="en"?"Certificate of Completion":"Certificado de Conclusão"}</p>
      <h2 style={{fontSize:"1.6rem",fontWeight:"normal",color:T.tx,marginBottom:"0.5rem",fontFamily:"Georgia,serif"}}>{lang==="en"?"Lands of Code":"Terras do Código"}</h2>
      <p style={{fontSize:"1.1rem",color:T.am,margin:"1rem 0",padding:"0.5rem 0",borderTop:`0.5px solid ${T.ab}`,borderBottom:`0.5px solid ${T.ab}`}}>{name||"Byte"}</p>
      <p style={{fontSize:12,color:T.mt,marginBottom:"1rem",lineHeight:1.7,fontFamily:"Georgia,serif"}}>{rank} · {score} {L.pts}</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginBottom:"1rem"}}>{concepts.slice(0,10).map((c,i)=>(<span key={i} style={{fontSize:10,background:T.al,border:`0.5px solid ${T.ab}`,color:T.am,padding:"2px 8px",borderRadius:4}}>{c}</span>))}</div>
      <p style={{fontSize:10,color:T.mt}}>{today}</p>
    </div>
    <NBtn onClick={dl} T={T}><i className="ti ti-download" style={{fontSize:12,marginRight:6}} aria-hidden="true"/>{L.certificateDl}</NBtn>
  </div>);}

// ── SESSION HISTORY ────────────────────────────────────────────
function SessionHistory({sessions,T,L,onClose}){
  if(!sessions.length)return(<div><p style={{fontSize:13,color:T.mt,fontFamily:"Georgia,serif",marginBottom:"1rem"}}>{L.sessionEmpty}</p><NBtn onClick={onClose} T={T}>{L.sessionClose}</NBtn></div>);
  const max=Math.max(...sessions.map(s=>s.score),1);
  return(<div>
    <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"1rem"}}>{L.sessionTitle}</p>
    <div style={{display:"flex",alignItems:"flex-end",gap:6,height:100,marginBottom:"1rem"}}>
      {sessions.slice(-10).map((s,i)=>{const h=Math.round((s.score/max)*90)+10;return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
        <div style={{fontSize:9,color:T.am}}>{s.score}</div>
        <div style={{width:"100%",height:h,background:i===sessions.slice(-10).length-1?T.am:T.al,border:`0.5px solid ${T.ab}`,borderRadius:"3px 3px 0 0",transition:"height 0.5s"}}/>
        <div style={{fontSize:9,color:T.mt,transform:"rotate(-35deg)",transformOrigin:"top",whiteSpace:"nowrap"}}>{new Date(s.date).toLocaleDateString(L.lang==="en"?"en":"pt-BR",{month:"short",day:"numeric"})}</div>
      </div>);})}
    </div>
    <p style={{fontSize:11,color:T.mt,marginBottom:"1rem",fontFamily:"Georgia,serif"}}>{L.sessionBest}: {Math.max(...sessions.map(s=>s.score))} {L.pts}</p>
    <NBtn onClick={onClose} T={T}>{L.sessionClose}</NBtn>
  </div>);}

// ── FRIEND COMPARE ────────────────────────────────────────────
function FriendCompare({name,score,rank,learned,lang,T,L,onClose}){
  const[copied,setCopied]=useState(false);const[compareData,setCompareData]=useState(null);
  const encoded=btoa(JSON.stringify({name,score,rank,concepts:learned.map(c=>lang==="en"?(c.nmEn||c.nm):c.nm).join(",")}));
  const link=`${window.location.href.split("?")[0]}?compare=${encoded}`;
  useEffect(()=>{
    try{
      const params=new URLSearchParams(window.location.search);
      const d=params.get("compare");
      if(d)setCompareData(JSON.parse(atob(d)));
    }catch{}
  },[]);
  const copyLink=()=>{try{navigator.clipboard.writeText(link);}catch{};setCopied(true);setTimeout(()=>setCopied(false),2500);};
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}>
      <button onClick={onClose} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button>
      <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.friendTitle}</p>
    </div>
    {compareData&&<div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"1rem",marginBottom:"1rem"}}>
      <p style={{fontSize:10,letterSpacing:2,color:T.am,textTransform:"uppercase",marginBottom:"0.5rem"}}>{L.friendCompareTitle}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[{n:name,s:score,r:rank},{n:compareData.name,s:compareData.score,r:compareData.rank}].map((p,i)=>(
          <div key={i} style={{background:T.bg,borderRadius:6,padding:"0.75rem",textAlign:"center"}}>
            <div style={{fontSize:13,color:T.am,marginBottom:3}}>{p.n}</div>
            <div style={{fontSize:20,fontWeight:500,color:T.tx}}>{p.s}</div>
            <div style={{fontSize:10,color:T.mt}}>{p.r}</div>
            {p.s===Math.max(score,compareData.score)&&<div style={{fontSize:10,color:T.gn,marginTop:4}}>🏆</div>}
          </div>
        ))}
      </div>
    </div>}
    <div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"1rem",marginBottom:"1rem"}}>
      <p style={{fontSize:12,color:T.mt,marginBottom:"0.65rem",fontFamily:"Georgia,serif"}}>{L.friendLink}</p>
      <div style={{background:T.cb,borderRadius:4,padding:"0.5rem 0.75rem",fontSize:10,color:T.mt,wordBreak:"break-all",marginBottom:"0.75rem"}}>{link.slice(0,60)}...</div>
      <button onClick={copyLink} style={{background:T.al,border:`0.5px solid ${T.am}`,color:T.am,padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:12,fontFamily:"Georgia,serif"}}>
        <i className={`ti ${copied?"ti-check":"ti-copy"}`} style={{fontSize:12,marginRight:5}} aria-hidden="true"/>
        {copied?L.friendCopied:L.friendCopy}
      </button>
    </div>
    <NBtn onClick={onClose} T={T}>{L.friendClose}</NBtn>
  </div>);}

// ── TOURNAMENT ────────────────────────────────────────────────
function TournamentSetup({T,L,lang,allScenes,career,onStart,onBack}){
  const careerIndices=CAREER_PATHS[career]?.indices||CAREER_PATHS.all.indices;
  const available=careerIndices.map(i=>allScenes[i]).filter(Boolean);
  const pick5=()=>{const s=[...available];for(let i=s.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[s[i],s[j]]=[s[j],s[i]];}return s.slice(0,Math.min(5,s.length));};
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}>
      <button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button>
      <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.tournamentTitle}</p>
    </div>
    <div style={{background:T.sf,border:`0.5px solid ${T.am}`,borderRadius:12,padding:"1.5rem",marginBottom:"1.5rem",textAlign:"center"}}>
      <i className="ti ti-tournament" style={{fontSize:40,color:T.am,display:"block",marginBottom:"0.75rem"}} aria-hidden="true"/>
      <p style={{fontSize:"0.95rem",color:T.tx,lineHeight:1.7,fontFamily:"Georgia,serif",marginBottom:"1rem"}}>{L.tournamentDesc}</p>
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
        {[["ti-clock","20s / cap"],["ti-star","score ×2"],["ti-tournament","5 caps"]].map(([ic,l])=>(<span key={l} style={{fontSize:11,background:T.al,border:`0.5px solid ${T.ab}`,color:T.am,padding:"3px 10px",borderRadius:4,display:"inline-flex",alignItems:"center",gap:4}}><i className={`ti ${ic}`} style={{fontSize:12}} aria-hidden="true"/>{l}</span>))}
      </div>
    </div>
    <NBtn onClick={()=>onStart(pick5())} T={T}>{L.tournamentStart}</NBtn>
  </div>);}

function TournamentEnd({score,maxScore,T,L,onBack,onRestart}){
  const pct=Math.round((score/Math.max(maxScore,1))*100);
  try{const lb=JSON.parse(localStorage.getItem("tdc_tourney")||"[]");lb.push({score,date:Date.now()});lb.sort((a,b)=>b.score-a.score);if(lb[0]?.score===score){}localStorage.setItem("tdc_tourney",JSON.stringify(lb.slice(0,10)));}catch{}
  return(<div style={{textAlign:"center",padding:"2rem 1rem"}}>
    <i className="ti ti-tournament" style={{fontSize:48,color:T.am,display:"block",marginBottom:"1rem"}} aria-hidden="true"/>
    <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.5rem"}}>{L.tournamentEnd}</p>
    <p style={{fontSize:"1.5rem",color:T.tx,marginBottom:"0.5rem",fontFamily:"Georgia,serif"}}>{score} {L.pts}</p>
    <div style={{height:6,background:T.al,borderRadius:99,overflow:"hidden",maxWidth:200,margin:"0.75rem auto 1.5rem"}}><div style={{width:`${pct}%`,height:"100%",background:T.am,borderRadius:99}}/></div>
    <div style={{display:"flex",gap:8,justifyContent:"center"}}>
      <NBtn onClick={onRestart} T={T}>{L.tournamentStart}</NBtn>
      <NBtn onClick={onBack} T={T}>{L.endMap}</NBtn>
    </div>
  </div>);}

// ── MAP / ACH / LB ────────────────────────────────────────────
function MapScreen({scenes,inventory,onJump,onBack,T,L}){return(<div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.mapTitle}</p></div><div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"1rem"}}><svg viewBox="0 0 100 100" style={{width:"100%",height:"auto",display:"block"}}><rect width="100" height="100" fill={T.bg} rx="4"/><text x="50" y="8" textAnchor="middle" fontSize="3.5" fill={T.am} fontFamily="Georgia,serif">{L.mapKingdom}</text>{scenes.map((sc,i)=>{if(!i)return null;const p=scenes[i-1];return<line key={i} x1={p.mapPos.x} y1={p.mapPos.y} x2={sc.mapPos.x} y2={sc.mapPos.y} stroke={T.ab} strokeWidth="0.5"/>})}{scenes.map((sc,i)=>{const done=inventory.find(s=>s.id===sc.id);const cl=done?T.gn:T.mt;return(<g key={sc.id} onClick={()=>onJump(i)} style={{cursor:"pointer"}}><circle cx={sc.mapPos.x} cy={sc.mapPos.y} r="3.5" fill={done?T.gn:T.sf} stroke={done?T.gn:T.ab} strokeWidth="0.5"/><text x={sc.mapPos.x} y={sc.mapPos.y-5} textAnchor="middle" fontSize="2.2" fill={cl} fontFamily="Georgia,serif">{sc.ch}</text>{done&&<text x={sc.mapPos.x} y={sc.mapPos.y+0.8} textAnchor="middle" fontSize="2.5" fill={T.bg}>✓</text>}</g>);})}</svg><p style={{fontSize:11,color:T.mt,textAlign:"center",marginTop:"0.5rem",fontFamily:"Georgia,serif"}}>{L.mapHint}</p></div></div>);}
function AchScreen({unlocked,T,L,onBack}){return(<div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.achTitle}</p></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:8}}>{ACH_IDS.map((id,i)=>{const got=unlocked.includes(id);const a=L.ach[i]||{nm:id,desc:""};return(<div key={id} style={{background:got?T.al:T.sf,border:`0.5px solid ${got?T.am:T.ab}`,borderRadius:8,padding:"0.85rem",opacity:got?1:0.45}}><i className={`ti ${ACH_ICONS[i]}`} style={{fontSize:20,color:got?T.am:T.mt,display:"block",marginBottom:6}} aria-hidden="true"/><div style={{fontSize:13,fontWeight:500,color:T.tx,marginBottom:3}}>{a.nm}</div><div style={{fontSize:11,color:T.mt}}>{a.desc}</div>{got&&<div style={{fontSize:10,color:T.gn,marginTop:5}}><i className="ti ti-check" style={{fontSize:10,marginRight:3}} aria-hidden="true"/>{L.achDone}</div>}</div>);})}</div></div>);}
function LeaderBoard({playerName,T,L,onBack}){const[sc]=useState(()=>{try{return JSON.parse(localStorage.getItem("tdc_lb")||"[]");}catch{return[];}});return(<div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.lbTitle}</p></div>{!sc.length?<p style={{color:T.mt,fontFamily:"Georgia,serif",fontSize:13}}>{L.lbEmpty}</p>:<div style={{display:"flex",flexDirection:"column",gap:6}}>{sc.slice(0,10).map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,background:s.name===playerName?T.al:T.sf,border:`0.5px solid ${s.name===playerName?T.am:T.ab}`,borderRadius:8,padding:"0.75rem 1rem"}}><span style={{fontSize:16,fontWeight:500,color:T.am,minWidth:24}}>#{i+1}</span><div style={{flex:1}}><div style={{fontSize:13,color:T.tx}}>{s.name}</div><div style={{fontSize:11,color:T.mt}}>{s.mode} · {new Date(s.date).toLocaleDateString()}</div></div><span style={{fontSize:15,fontWeight:500,color:T.am}}>{s.score}{L.pts}</span></div>)}</div>}</div>);}

// ── PROFILE ───────────────────────────────────────────────────
function ProfileScreen({name,score,maxScore,learned,unlocked,inventory,difficulty,mode,xpData,streak,T,L,lang,onBack,onCert,onHistory,onFriend}){
  const pct=Math.round((score/maxScore)*100);const ri=pct>=90?0:pct>=70?1:pct>=50?2:3;const rank=L.ranks[ri];const today=new Date().toLocaleDateString();
  const xpTitle=lang==="en"?xpData.enTi:xpData.ptTi;const concepts=learned.map(c=>lang==="en"?(c.nmEn||c.nm):c.nm);
  const dlCard=()=>{const t=`${L.cardTitle}\n${"─".repeat(40)}\n${L.cardName} ${name}\n${L.cardRank} ${rank}\n${L.cardScore} ${score}/${maxScore} (${pct}%)\n${L.cardConcepts} ${concepts.join(", ")}\n${L.cardAch} ${unlocked.length}/${ACH_IDS.length}\nLevel ${xpData.lvl} — ${xpTitle}\n${today}`;const b=new Blob([t],{type:"text/plain"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="developer-card.txt";a.click();};
  const shareCard=()=>{const canvas=document.createElement("canvas");canvas.width=600;canvas.height=300;const ctx=canvas.getContext("2d");ctx.fillStyle=TH.dark.bg;ctx.fillRect(0,0,600,300);ctx.fillStyle=TH.dark.am;ctx.fillRect(0,0,600,4);ctx.fillStyle=TH.dark.sf;ctx.beginPath();ctx.roundRect(30,20,540,260,10);ctx.fill();ctx.strokeStyle=TH.dark.am+"40";ctx.lineWidth=1;ctx.stroke();ctx.fillStyle=TH.dark.am;ctx.font="bold 11px monospace";ctx.fillText(lang==="en"?"LANDS OF CODE":"TERRAS DO CÓDIGO",50,50);ctx.fillStyle=TH.dark.tx;ctx.font="bold 24px Georgia";ctx.fillText(name||"Byte",50,85);ctx.fillStyle=TH.dark.am;ctx.font="13px Georgia";ctx.fillText(rank,50,108);ctx.fillStyle=TH.dark.tx;ctx.font="12px sans-serif";ctx.fillText(`${score}/${maxScore} (${pct}%)`,50,140);ctx.fillStyle=TH.dark.gn;ctx.font="11px monospace";ctx.fillText(concepts.slice(0,6).join(" · "),50,165);const bw=500,bh=6,by=185;ctx.fillStyle=TH.dark.am+"25";ctx.beginPath();ctx.roundRect(50,by,bw,bh,3);ctx.fill();ctx.fillStyle=TH.dark.am;ctx.beginPath();ctx.roundRect(50,by,bw*(pct/100),bh,3);ctx.fill();ctx.fillStyle=TH.dark.mt;ctx.font="10px monospace";ctx.fillText(today,50,218);ctx.textAlign="right";ctx.fillStyle=TH.dark.am;ctx.fillText("terrasDocodigo.dev",550,218);const u=canvas.toDataURL("image/png");const a=document.createElement("a");a.href=u;a.download="developer-card.png";a.click();};
  const[avatar,setAvatar]=useState(()=>{try{return localStorage.getItem(`tdc_av_${name}`)||"";}catch{return "";}});const[avLoad,setAvLoad]=useState(false);
  const genAvatar=async()=>{setAvLoad(true);try{const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,messages:[{role:"user",content:`Create an 8-line ASCII art avatar (max 20 chars wide) for programmer "${name}" at rank "${rank}". Only printable ASCII + unicode geometric chars. Programmer-themed. Return ONLY the art, no backticks.`}]})});const d=await res.json();const art=d.content?.find(b=>b.type==="text")?.text||"";setAvatar(art);try{localStorage.setItem(`tdc_av_${name}`,art);}catch{}}catch{}setAvLoad(false);};
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.profileTitle}</p></div>
    <div style={{background:T.sf,border:`0.5px solid ${T.am}`,borderRadius:12,padding:"1.5rem",marginBottom:"1rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:"1.25rem"}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:T.al,border:`0.5px solid ${T.am}`,display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ti ti-user-circle" style={{fontSize:26,color:T.am}} aria-hidden="true"/></div>
        <div><div style={{fontSize:"1.2rem",color:T.tx,fontFamily:"Georgia,serif"}}>{name||"Byte"}</div><div style={{fontSize:11,color:T.am,letterSpacing:2}}>{rank.toUpperCase()}</div><div style={{fontSize:11,color:T.mt}}>Lv.{xpData.lvl} · {xpData.xp} XP · {streak} <i className="ti ti-flame" style={{fontSize:11,color:T.cr}} aria-hidden="true"/></div></div>
      </div>
      <XPBar xpData={xpData} lang={lang} T={T} L={L}/>
      {avatar?<pre style={{fontFamily:"Courier New,monospace",fontSize:"0.75rem",color:T.am,background:T.cb,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.75rem",lineHeight:1.6,marginBottom:8,overflowX:"auto"}}>{avatar}</pre>:null}
      <button onClick={genAvatar} disabled={avLoad} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:avLoad?T.mt:T.am,padding:"3px 12px",borderRadius:6,cursor:avLoad?"default":"pointer",fontSize:11,fontFamily:"Georgia,serif",marginBottom:"1rem"}}><i className="ti ti-sparkles" style={{fontSize:11,marginRight:4}} aria-hidden="true"/>{avLoad?L.profileAvatarLoading:L.profileAvatar}</button>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:"1.25rem"}}>{[[L.profileScore,`${score}/${maxScore}`],[L.profilePct,`${pct}%`],[L.profileAch,`${unlocked.length}/${ACH_IDS.length}`]].map(([l,v])=>(<div key={l} style={{background:T.bg,borderRadius:6,padding:"0.6rem",textAlign:"center"}}><div style={{fontSize:18,fontWeight:500,color:T.am}}>{v}</div><div style={{fontSize:10,color:T.mt}}>{l}</div></div>))}</div>
      <div style={{marginBottom:"1rem"}}><p style={{fontSize:10,letterSpacing:2,color:T.mt,textTransform:"uppercase",marginBottom:6}}>{L.profileConcepts}</p><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{concepts.map((c,i)=>(<span key={i} style={{fontSize:11,background:T.al,border:`0.5px solid ${T.ab}`,color:T.am,padding:"2px 10px",borderRadius:4}}>{c}</span>))}</div></div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      <NBtn onClick={dlCard} T={T}><i className="ti ti-download" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.profileDl}</NBtn>
      <NBtn onClick={shareCard} T={T}><i className="ti ti-share" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.profileShare}</NBtn>
      <NBtn onClick={onCert} T={T}><i className="ti ti-certificate" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.endCert}</NBtn>
      <NBtn onClick={onHistory} T={T}><i className="ti ti-chart-line" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.sessionTitle}</NBtn>
      <NBtn onClick={onFriend} T={T}><i className="ti ti-users" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.friendTitle}</NBtn>
    </div>
  </div>);}

function dlCheatsheet(learned,L){const lines=[L.cheatTitle,"=".repeat(50),""];learned.forEach(c=>{const nm=L.lang==="en"?(c.nmEn||c.nm):c.nm;const sm=L.lang==="en"?(c.sumEn||c.sum):c.sum;lines.push(`▸ ${nm.toUpperCase()}`);lines.push(sm);lines.push("");lines.push("Python:");lines.push(c.py||"");lines.push("");lines.push("JavaScript:");lines.push(c.js||"");lines.push("-".repeat(50));lines.push("");});const b=new Blob([lines.join("\n")],{type:"text/plain"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="cheatsheet.txt";a.click();}

// ── CODE ANIMATION ───────────────────────────────────────────
function CodeAnim({sceneId,lang,T,L}){
  const steps=ANIM_STEPS[sceneId];const[step,setStep]=useState(0);
  if(!steps)return(<p style={{fontSize:12,color:T.mt,fontFamily:"Georgia,serif",padding:"0.5rem 0"}}>{L.animNoAnim}</p>);
  const s=steps[step];
  return(<div>
    <div style={{background:T.cb,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.9rem 1.1rem",marginBottom:8}}><pre style={{fontFamily:"Courier New,monospace",fontSize:"0.82rem",color:"#b8dfa0",margin:0,lineHeight:1.7}}>{s.code}</pre></div>
    <div style={{display:"flex",gap:8,marginBottom:8}}>
      <div style={{flex:1,background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.6rem 0.9rem"}}>
        <div style={{fontSize:10,letterSpacing:2,color:T.am,textTransform:"uppercase",marginBottom:4}}>{L.animVars}</div>
        {Object.entries(s.vars).map(([k,v])=>(<div key={k} style={{fontSize:12,fontFamily:"Courier New,monospace",color:T.tx,marginBottom:2}}><span style={{color:T.am}}>{k}</span> = <span style={{color:T.gn}}>{JSON.stringify(v)}</span></div>))}
        {!Object.keys(s.vars).length&&<span style={{fontSize:11,color:T.mt}}>—</span>}
      </div>
      {s.out&&<div style={{background:"rgba(93,202,165,.07)",border:"0.5px solid rgba(93,202,165,.3)",borderRadius:6,padding:"0.6rem 0.9rem",minWidth:80}}><div style={{fontSize:10,letterSpacing:2,color:T.gn,textTransform:"uppercase",marginBottom:4}}>{L.animOut}</div><pre style={{fontFamily:"Courier New,monospace",fontSize:12,color:T.gn,margin:0}}>{s.out}</pre></div>}
    </div>
    <p style={{fontSize:12,color:T.am,marginBottom:8,fontFamily:"Georgia,serif"}}>{s.desc[lang]||s.desc.pt}</p>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,padding:"3px 10px",borderRadius:4,cursor:step===0?"default":"pointer",fontSize:13}}>{L.animPrev}</button>
      <span style={{fontSize:11,color:T.mt,fontFamily:"Georgia,serif"}}>{L.animStep} {step+1} {L.animOf} {steps.length}</span>
      <div style={{flex:1,height:2,background:T.al,borderRadius:99}}><div style={{width:`${((step+1)/steps.length)*100}%`,height:"100%",background:T.am,borderRadius:99,transition:"width 0.3s"}}/></div>
      <button onClick={()=>setStep(s=>Math.min(steps.length-1,s+1))} disabled={step===steps.length-1} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,padding:"3px 10px",borderRadius:4,cursor:step===steps.length-1?"default":"pointer",fontSize:13}}>{L.animNext}</button>
    </div>
  </div>);}

// ── BOSS CHALLENGE ────────────────────────────────────────────
function BossChallenge({boss,lang,T,L,onDone,addXP}){
  const[started,setStarted]=useState(false);const[qIdx,setQIdx]=useState(0);const[sel,setSel]=useState(null);const[rev,setRev]=useState(false);
  const[correct,setCorrect]=useState(0);const[timer,setTimer]=useState(20);const timerRef=useRef(null);
  const q=boss.questions[qIdx];const question=lang==="en"?(q.qEn||q.q):q.q;const opts=lang==="en"?(q.optsEn||q.opts):q.opts;
  const title=lang==="en"?(boss.enTitle||boss.ptTitle):boss.ptTitle;const intro=lang==="en"?(boss.enIntro||boss.ptIntro):boss.ptIntro;
  useEffect(()=>{if(!started)return;setTimer(20);setSel(null);setRev(false);timerRef.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(timerRef.current);setRev(true);return 0;}return t-1;}),1000);return()=>clearInterval(timerRef.current);},[qIdx,started]);
  const pick=(i)=>{clearInterval(timerRef.current);setSel(i);setRev(true);if(i===q.ok)setCorrect(c=>c+1);};
  const next=()=>{if(qIdx<boss.questions.length-1){setQIdx(i=>i+1);}else{addXP(boss.xpBonus);onDone(correct*15);}};
  if(!started)return(<div style={{textAlign:"center",paddingTop:"1.5rem"}}>
    <div style={{fontSize:40,marginBottom:"0.75rem"}}><i className={`ti ${boss.icon}`} style={{color:T.cr}} aria-hidden="true"/></div>
    <p style={{fontSize:10,letterSpacing:3,color:T.cr,textTransform:"uppercase",marginBottom:"0.5rem"}}>{L.bossIntro}</p>
    <h2 style={{fontSize:"1.3rem",fontWeight:"normal",color:T.tx,marginBottom:"1rem",fontFamily:"Georgia,serif"}}>{title}</h2>
    <p style={{fontSize:"0.9rem",color:T.mt,marginBottom:"1.5rem",fontFamily:"Georgia,serif",lineHeight:1.7,maxWidth:380,margin:"0 auto 1.5rem"}}>{intro}</p>
    <div style={{display:"flex",gap:10,justifyContent:"center"}}>
      <NBtn onClick={()=>setStarted(true)} T={T}><i className="ti ti-sword" style={{fontSize:12,marginRight:6}} aria-hidden="true"/>⚔️ {lang==="en"?"Fight!":"Lutar!"} →</NBtn>
      <NBtn onClick={()=>onDone(0)} T={T}>{lang==="en"?L.bossSkip:L.bossSkip}</NBtn>
    </div>
  </div>);
  if(rev&&qIdx===boss.questions.length-1&&sel!==null)return(<div style={{textAlign:"center",paddingTop:"1.5rem"}}>
    <i className="ti ti-trophy" style={{fontSize:40,color:T.am,display:"block",marginBottom:"0.75rem"}} aria-hidden="true"/>
    <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.5rem"}}>{L.bossWin}</p>
    <p style={{fontSize:"1.1rem",color:T.tx,marginBottom:"0.5rem",fontFamily:"Georgia,serif"}}>{correct}/{boss.questions.length} · {correct*15} {L.pts}</p>
    <p style={{fontSize:12,color:T.gn,marginBottom:"1.5rem"}}>{L.bossBonusXP} +{boss.xpBonus} XP</p>
    <NBtn onClick={next} T={T}>{L.bossNext}</NBtn>
  </div>);
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1rem"}}>
      <span style={{fontSize:10,letterSpacing:2,color:T.cr,textTransform:"uppercase"}}>{L.bossQ} {qIdx+1} {L.bossOf} {boss.questions.length}</span>
      <span style={{fontSize:11,color:timer<8?T.cr:T.mt}}>{L.bossTime} {timer}s</span>
    </div>
    <div style={{height:3,background:T.al,borderRadius:99,marginBottom:"1rem",overflow:"hidden"}}><div style={{width:`${(timer/20)*100}%`,height:"100%",background:timer<8?T.cr:T.am,transition:"width 1s linear",borderRadius:99}}/></div>
    <p style={{fontSize:"1rem",color:T.tx,marginBottom:"1.25rem",fontFamily:"Georgia,serif",lineHeight:1.7}}>{question}</p>
    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:"1rem"}}>{opts.map((o,i)=>{let bd=T.ab,bg="transparent",tc=T.tx;if(rev){if(i===q.ok){bd="rgba(93,202,165,.5)";bg="rgba(93,202,165,.08)";tc=T.gn;}else if(i===sel){bd="rgba(216,90,48,.5)";bg="rgba(216,90,48,.08)";tc=T.cr;}}else if(i===sel){bd=T.am;bg=T.al;}return(<button key={i} onClick={()=>!rev&&pick(i)} style={{background:bg,border:`0.5px solid ${bd}`,color:tc,padding:"0.75rem 1rem",textAlign:"left",cursor:rev?"default":"pointer",borderRadius:8,fontSize:"0.9rem",fontFamily:"Georgia,serif",lineHeight:1.5}}>{o}</button>);})}</div>
    {rev&&<div><p style={{fontSize:13,color:sel===q.ok?T.gn:T.mt,marginBottom:"1rem",fontFamily:"Georgia,serif"}}>{sel===q.ok?`${L.bossCorrect}15 pts`:L.bossWrong}</p><NBtn onClick={next} T={T}>{qIdx<boss.questions.length-1?`${L.bossQ} ${qIdx+2} →`:L.bossWin+" →"}</NBtn></div>}
  </div>);}

// ── FIX BUG ───────────────────────────────────────────────────
function FixBug({scene,T,L,onNext,addScore,onAchieve}){
  const bug=BUGS.find(b=>b.id===scene.id);const[code,setCode]=useState(bug?.broken||"");const[out,setOut]=useState("");const[pass,setPass]=useState(false);const[running,setRunning]=useState(false);const[skulptReady,setSkulptReady]=useState(!!window.Sk);const[tried,setTried]=useState(false);
  const hint=L.lang==="en"?(bug?.enHint||""):bug?.ptHint||"";const title=L.lang==="en"?(bug?.enTitle||bug?.ptTitle||""):bug?.ptTitle||"";
  useEffect(()=>{if(!window.Sk){const s1=document.createElement("script");s1.src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js";s1.onload=()=>{const s2=document.createElement("script");s2.src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js";s2.onload=()=>setSkulptReady(true);document.head.appendChild(s2);};document.head.appendChild(s1);}else setSkulptReady(true);},[]);
  const runTest=()=>{if(!bug||!window.Sk){setRunning(false);return;}setRunning(true);setTried(true);let o="";window.Sk.configure({output:t=>{o+=t;},read:f=>{if(window.Sk.builtinFiles?.files[f])return window.Sk.builtinFiles.files[f];throw f;}});window.Sk.misceval.asyncToPromise(()=>window.Sk.importMainWithBody("<stdin>",false,code,true)).then(()=>{const ok=o.trim()===(bug.expected||"").trim();setOut(o.trim());setPass(ok);if(ok){addScore(15);onAchieve("bug_fixer");}}).catch(e=>setOut("Erro: "+e.toString())).finally(()=>setRunning(false));};
  if(!bug)return(<div><p style={{fontSize:13,color:T.mt,fontFamily:"Georgia,serif",marginBottom:"1rem"}}>Sem desafio de bug para este capítulo.</p><NBtn onClick={onNext} T={T}>{L.bugSkip}</NBtn></div>);
  return(<div>
    <p style={{fontSize:10,letterSpacing:3,color:T.cr,textTransform:"uppercase",marginBottom:"0.5rem"}}><i className="ti ti-bug" style={{fontSize:13,marginRight:6,verticalAlign:"-1px"}} aria-hidden="true"/>{L.bugTitle} — {title}</p>
    <div style={{background:"rgba(216,90,48,.05)",border:"0.5px solid rgba(216,90,48,.2)",borderRadius:6,padding:"0.6rem 0.9rem",marginBottom:"0.85rem",fontSize:12,color:T.cr,fontFamily:"Georgia,serif"}}><i className="ti ti-bulb" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.bugHint} {hint}</div>
    <textarea value={code} onChange={e=>setCode(e.target.value)} style={{width:"100%",background:T.cb,border:`0.5px solid ${pass?"rgba(93,202,165,.5)":"rgba(216,90,48,.35)"}`,borderRadius:6,padding:"0.9rem 1.1rem",fontFamily:"Courier New,monospace",fontSize:"0.8rem",color:"#f4a0a0",lineHeight:1.78,resize:"vertical",minHeight:120,boxSizing:"border-box",outline:"none",marginBottom:8}}/>
    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:"0.75rem"}}>
      <button onClick={runTest} disabled={running||!skulptReady} style={{background:"rgba(216,90,48,.1)",border:"0.5px solid rgba(216,90,48,.4)",color:T.cr,padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif",display:"flex",alignItems:"center",gap:6}}><i className="ti ti-player-play" style={{fontSize:13}} aria-hidden="true"/>{running?L.bugRunning:L.bugRun}</button>
      {!skulptReady&&<span style={{fontSize:10,color:T.mt}}>{L.skulptLoading}</span>}
    </div>
    {tried&&<div style={{marginBottom:"1rem"}}><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      <div style={{flex:1,minWidth:120,background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.6rem 0.9rem"}}><div style={{fontSize:10,color:T.mt,marginBottom:3}}>{L.bugExpected}</div><pre style={{fontFamily:"Courier New,monospace",fontSize:11,color:T.gn,margin:0}}>{bug.expected}</pre></div>
      <div style={{flex:1,minWidth:120,background:T.sf,border:`0.5px solid ${pass?"rgba(93,202,165,.4)":"rgba(216,90,48,.3)"}`,borderRadius:6,padding:"0.6rem 0.9rem"}}><div style={{fontSize:10,color:T.mt,marginBottom:3}}>{L.bugGot}</div><pre style={{fontFamily:"Courier New,monospace",fontSize:11,color:pass?T.gn:T.cr,margin:0}}>{out||"—"}</pre></div>
    </div>
    {pass&&<p style={{fontSize:13,color:T.gn,marginTop:8,fontFamily:"Georgia,serif"}}>{L.bugPass}</p>}
    {!pass&&out&&<p style={{fontSize:13,color:T.mt,marginTop:8,fontFamily:"Georgia,serif"}}>{L.bugFail}</p>}
    </div>}
    <div style={{display:"flex",gap:8}}>{pass&&<NBtn onClick={onNext} T={T}>{L.quizNextCh}</NBtn>}<button onClick={onNext} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:12,fontFamily:"Georgia,serif"}}>{L.bugSkip}</button></div>
  </div>);}

// ── SANDBOX ───────────────────────────────────────────────────
function Sandbox({scene,language,T,L,onNext,onAchieve}){
  const[code,setCode]=useState(language==="js"?scene.concept.js:scene.concept.py);const[out,setOut]=useState("");const[running,setRunning]=useState(false);const[skulptReady,setSkulptReady]=useState(!!window.Sk);const[lang,setLang]=useState(language==="js"?"js":"py");
  useEffect(()=>{if(!window.Sk){const s1=document.createElement("script");s1.src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js";s1.onload=()=>{const s2=document.createElement("script");s2.src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js";s2.onload=()=>setSkulptReady(true);document.head.appendChild(s2);};document.head.appendChild(s1);}else setSkulptReady(true);},[]);
  useEffect(()=>{setCode(lang==="js"?scene.concept.js:scene.concept.py);},[lang]);
  const runJS=()=>{let logs=[];const orig=console.log;console.log=(...a)=>{logs.push(a.map(x=>typeof x==="object"?JSON.stringify(x):String(x)).join(" "));orig(...a);};try{new Function(code)();setOut(logs.join("\n")||`(${L.sandboxNoOut} console.log?)`);}catch(e){setOut("Error: "+e.message);}finally{console.log=orig;}};
  const runPY=()=>{if(!window.Sk){setOut(L.skulptLoading);return;}let o="";window.Sk.configure({output:t=>{o+=t;},read:f=>{if(window.Sk.builtinFiles?.files[f])return window.Sk.builtinFiles.files[f];throw f;}});window.Sk.misceval.asyncToPromise(()=>window.Sk.importMainWithBody("<stdin>",false,code,true)).then(()=>setOut(o||`(${L.sandboxNoOut} print?)`)).catch(e=>setOut("Error: "+e.toString())).finally(()=>setRunning(false));};
  const run=()=>{setRunning(true);setOut("");onAchieve("sandbox_a");if(lang==="js"){runJS();setRunning(false);}else runPY();};
  return(<div>
    <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.75rem"}}><i className="ti ti-terminal-2" style={{fontSize:13,marginRight:6,verticalAlign:"-1px"}} aria-hidden="true"/>{L.sandboxTitle}</p>
    <div style={{display:"flex",gap:6,marginBottom:8}}>{[["py","Python"],["js","JavaScript"]].map(([k,l])=>(<button key={k} onClick={()=>setLang(k)} style={{background:lang===k?T.al:"transparent",border:`0.5px solid ${lang===k?T.am:T.ab}`,color:lang===k?T.am:T.mt,padding:"3px 12px",borderRadius:4,cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif"}}>{l}</button>))}</div>
    <textarea value={code} onChange={e=>setCode(e.target.value)} style={{width:"100%",background:T.cb,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.9rem 1.1rem",fontFamily:"Courier New,monospace",fontSize:"0.8rem",color:"#b8dfa0",lineHeight:1.78,resize:"vertical",minHeight:120,boxSizing:"border-box",outline:"none",marginBottom:8}}/>
    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:"0.75rem"}}><button onClick={run} disabled={running||(lang==="py"&&!skulptReady)} style={{background:T.al,border:`0.5px solid ${T.am}`,color:T.am,padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif",display:"flex",alignItems:"center",gap:6}}><i className="ti ti-player-play" style={{fontSize:13}} aria-hidden="true"/>{running?L.sandboxRunning:L.sandboxRun}</button><span style={{fontSize:11,color:T.mt}}>{L.sandboxHint}</span></div>
    {out&&<pre style={{background:T.cb,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.85rem 1.1rem",fontSize:"0.78rem",color:out.startsWith("Error")||out.startsWith("Erro")?T.cr:"#b8dfa0",fontFamily:"Courier New,monospace",lineHeight:1.7,whiteSpace:"pre-wrap",marginBottom:"1rem",maxHeight:150,overflowY:"auto"}}>{out}</pre>}
    <NBtn onClick={onNext} T={T}>{L.sandboxNext}</NBtn>
  </div>);}

// ── REVIEW ERRORS ─────────────────────────────────────────────
function ReviewErrors({errors,lang,T,L,onClose}){return(<div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onClose} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.reviewTitle}</p></div>{!errors.length?<p style={{fontSize:13,color:T.gn,fontFamily:"Georgia,serif"}}>{L.reviewEmpty}</p>:<div style={{display:"flex",flexDirection:"column",gap:10}}>{errors.map((e,i)=>{const q=lang==="en"?(e.quiz.qEn||e.quiz.q):e.quiz.q;const opts=lang==="en"?(e.quiz.optsEn||e.quiz.opts):e.quiz.opts;const correct=opts[e.quiz.ok];const chosen=opts[e.chosen];const title=lang==="en"?(e.titleEn||e.title||""):e.title||"";return(<div key={i} style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"1rem"}}><div style={{fontSize:10,letterSpacing:2,color:T.cr,textTransform:"uppercase",marginBottom:4}}>{title}</div><p style={{fontSize:13,color:T.tx,marginBottom:6,fontFamily:"Georgia,serif"}}><strong>{L.reviewQ}</strong> {q}</p><div style={{display:"flex",flexDirection:"column",gap:4}}><span style={{fontSize:12,background:"rgba(216,90,48,.08)",border:"0.5px solid rgba(216,90,48,.3)",color:T.cr,padding:"4px 10px",borderRadius:4}}><i className="ti ti-x" style={{fontSize:11,marginRight:5}} aria-hidden="true"/>Você: {chosen}</span><span style={{fontSize:12,background:"rgba(93,202,165,.08)",border:"0.5px solid rgba(93,202,165,.3)",color:T.gn,padding:"4px 10px",borderRadius:4}}><i className="ti ti-check" style={{fontSize:11,marginRight:5}} aria-hidden="true"/>{L.reviewCorrect} {correct}</span></div></div>);})}</div>}</div>);}

// ── INTRO ─────────────────────────────────────────────────────
function Intro({onStart,onDaily,onMulti,onTournament,onChapterPick,settings,setSettings,streak,xpData,inventory}){
  const L=UI[settings.lang||"pt"];const T=TH[settings.theme];const lang=settings.lang||"pt";
  const dailyIdx=(()=>{const d=new Date().toDateString();let h=0;for(const c of d)h=(h*31+c.charCodeAt(0))%SCENES.length;return h;})();
  const diffOpts=lang==="en"?[["beginner",L.diffInit],["challenging",L.diffHard]]:[["iniciante",L.diffInit],["desafiador",L.diffHard]];
  const xpTitle=lang==="en"?xpData.enTi:xpData.ptTi;
  const careerOpts=[["all",L.careerAll],["frontend",L.careerFront],["backend",L.careerBack],["data",L.careerData]];
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
      {[["pt","🇧🇷 PT"],["en","🇺🇸 EN"]].map(([v,l])=>(<button key={v} onClick={()=>setSettings(s=>({...s,lang:v}))} style={{background:settings.lang===v?T.al:"transparent",border:`0.5px solid ${settings.lang===v?T.am:T.ab}`,color:settings.lang===v?T.am:T.mt,padding:"5px 14px",borderRadius:20,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}>{l}</button>))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))",gap:10,marginBottom:"1.25rem"}}>
      {[[L.settingTheme,"theme",[["dark","Grimório"],["light","Pergaminho"],["cyber","Neon"]]],
        [L.settingDiff,"difficulty",diffOpts],
        [L.settingCode,"language",[["py",L.langPy],["js",L.langJs],["both",L.langBoth]]],
        [L.settingCareer,"career",careerOpts]].map(([label,key,opts])=>(
        <div key={key} style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"0.9rem"}}>
          <p style={{fontSize:10,letterSpacing:2,color:T.am,textTransform:"uppercase",marginBottom:"0.55rem"}}>{label}</p>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {opts.map(([v,l])=>(<button key={v} onClick={()=>setSettings(s=>({...s,[key]:v}))} style={{background:settings[key]===v?T.al:"transparent",border:`0.5px solid ${settings[key]===v?T.am:T.ab}`,color:settings[key]===v?T.am:T.mt,padding:"4px 9px",borderRadius:4,cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif",textAlign:"left"}}>{settings[key]===v&&"✓ "}{l}</button>))}
          </div>
        </div>))}
    </div>
    <div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"0.9rem",marginBottom:"0.85rem"}}>
      <p style={{fontSize:10,letterSpacing:2,color:T.am,textTransform:"uppercase",marginBottom:"0.55rem"}}>{L.settingPlayer}</p>
      <input value={settings.p1} onChange={e=>setSettings(s=>({...s,p1:e.target.value}))} placeholder="Byte" style={{background:T.cb,border:`0.5px solid ${T.ab}`,color:T.tx,padding:"5px 9px",borderRadius:4,fontSize:13,fontFamily:"Georgia,serif",outline:"none",width:"100%",boxSizing:"border-box"}}/>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:"0.75rem"}}>
      <NBtn onClick={onStart} T={T}>{L.playSolo}</NBtn>
      <NBtn onClick={onMulti} T={T}><i className="ti ti-users" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.playMulti}</NBtn>
      <NBtn onClick={()=>onDaily(dailyIdx)} T={T}><i className="ti ti-calendar" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.playDaily}</NBtn>
      <NBtn onClick={onTournament} T={T}><i className="ti ti-tournament" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.playTournament}</NBtn>
    </div>
    <div style={{display:"flex",gap:8,justifyContent:"center"}}>
      {inventory.length>0&&<button onClick={onChapterPick} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif"}}><i className="ti ti-list" style={{fontSize:11,marginRight:4}} aria-hidden="true"/>{L.chapterPickTitle}</button>}
    </div>
    <p style={{fontSize:11,color:T.mt,textAlign:"center",marginTop:"0.65rem",fontFamily:"Georgia,serif"}}>{L.dailyToday} {lang==="en"?(SCENES[dailyIdx].titleEn||SCENES[dailyIdx].title||""):SCENES[dailyIdx].title||""}</p>
  </div>);}

function MultiSetup({T,L,settings,setSettings,onStart,onBack}){return(<div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}><button onClick={onBack} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif"}}><i className="ti ti-arrow-left" style={{fontSize:13,marginRight:6}} aria-hidden="true"/>{L.back}</button><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}>{L.multiTitle}</p></div><p style={{fontSize:"0.9rem",color:T.tx,marginBottom:"1.5rem",fontFamily:"Georgia,serif",lineHeight:1.7}}>{L.multiDesc}</p>{[[L.player1,"p1"],[L.player2,"p2"]].map(([label,key])=>(<div key={key} style={{marginBottom:"1rem"}}><p style={{fontSize:11,color:T.am,marginBottom:5,fontFamily:"Georgia,serif"}}>{label}</p><input value={settings[key]} onChange={e=>setSettings(s=>({...s,[key]:e.target.value}))} placeholder={label} style={{background:T.sf,border:`0.5px solid ${T.ab}`,color:T.tx,padding:"8px 12px",borderRadius:4,fontSize:13,fontFamily:"Georgia,serif",outline:"none",width:"100%",boxSizing:"border-box"}}/></div>))}<NBtn onClick={onStart} T={T}><i className="ti ti-users" style={{fontSize:12,marginRight:6}} aria-hidden="true"/>{L.startMulti}</NBtn></div>);}
function PlayerSwitch({next,score,T,L,onContinue}){return(<div style={{textAlign:"center",paddingTop:"2rem"}}><i className="ti ti-arrow-left-right" style={{fontSize:40,color:T.am,display:"block",marginBottom:"1rem"}} aria-hidden="true"/><p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.5rem"}}>{L.switchTitle}</p><p style={{fontSize:"1.1rem",color:T.tx,marginBottom:"0.5rem",fontFamily:"Georgia,serif"}}>{L.switchScore} {score} {L.pts}</p><p style={{fontSize:"0.9rem",color:T.mt,marginBottom:"2rem",fontFamily:"Georgia,serif"}}>{L.switchPass} <strong style={{color:T.am}}>{next}</strong></p><NBtn onClick={onContinue} T={T}>{L.switchBtn} {next} →</NBtn></div>);}

// ── READING ───────────────────────────────────────────────────
function Reading({scene,difficulty,lang,hintLevel,onHint,onPick,T,L,hintCost,timerSecs,timerMax,isSpeed}){
  const isHard=difficulty==="desafiador"||difficulty==="challenging";
  const narr=isHard?S(scene,"narrH",lang):S(scene,"narr",lang);
  const chLabel=lang==="en"?(scene.chEn||scene.ch):scene.ch;
  const title=lang==="en"?(scene.titleEn||scene.title||scene.id):scene.title||scene.id;
  const hints=[S(scene,"hint",lang),scene.concept?(lang==="en"?(scene.concept.sumEn||scene.concept.sum):scene.concept.sum):"",scene.choices?.[0]?(SC(scene.choices[0],"text",lang)):""];
  const hintLabels=[`${L.hintBtn} 1 (${L.hintFree}) — ${L.hintL1}`,`${L.hintBtn} 2 (${L.hintCost.replace("{n}",2)}) — ${L.hintL2}`,`${L.hintBtn} 3 (${L.hintCost.replace("{n}",5)}) — ${L.hintL3}`];
  return(<div>
    <div style={{marginBottom:"1.25rem"}}>
      <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",marginBottom:"0.3rem"}}><i className={`ti ${scene.icon}`} style={{fontSize:13,marginRight:6,verticalAlign:"-1px"}} aria-hidden="true"/>{chLabel}</p>
      <h2 style={{fontSize:"1.3rem",fontWeight:"normal",color:T.tx,margin:0,fontFamily:"Georgia,serif"}}>{title}</h2>
    </div>
    {scene.portrait&&<Portrait p={scene.portrait} lang={lang} T={T}/>}
    {isSpeed&&<TimerBar secs={timerSecs} max={timerMax} T={T} L={L}/>}
    <div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"1.4rem 1.5rem",marginBottom:"1.25rem",lineHeight:1.85,fontSize:"0.92rem",whiteSpace:"pre-line",color:T.tx,fontFamily:"Georgia,serif"}}>{narr}</div>
    {hintLevel===0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:"1rem"}}>
      {hintLabels.map((hl,i)=>(<button key={i} onClick={()=>onHint(i+1)} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,padding:"3px 10px",borderRadius:6,cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif"}}>{hl}</button>))}
    </div>}
    {hintLevel>0&&<div style={{marginBottom:"1rem"}}>
      {Array.from({length:hintLevel},(_,i)=>(<div key={i} style={{background:`rgba(239,159,39,${0.04+i*0.02})`,border:`0.5px solid ${T.ab}`,borderRadius:6,padding:"0.5rem 0.9rem",marginBottom:5,fontSize:12,color:T.am,fontFamily:"Georgia,serif",lineHeight:1.6}}><i className="ti ti-bulb" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{hints[i]}</div>))}
      {hintLevel<3&&<button onClick={()=>onHint(hintLevel+1)} style={{background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,padding:"3px 10px",borderRadius:6,cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif"}}>{hintLabels[hintLevel]}</button>}
    </div>}
    <p style={{fontSize:10,letterSpacing:3,color:T.mt,textTransform:"uppercase",marginBottom:"0.65rem"}}>{L.whatDo}</p>
    <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>{scene.choices.map((c,i)=><CBtn key={i} onClick={()=>onPick(i)} T={T}>{SC(c,"text",lang)}</CBtn>)}</div>
  </div>);}

function Chosen({choice,lang,T,L,onContinue}){const g=choice.good;const clr=g?T.gn:T.cr;const cbd=g?"rgba(93,202,165,.22)":"rgba(216,90,48,.22)";const cons=SC(choice,"cons",lang);return(<div><div style={{marginBottom:"1rem"}}><span style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:clr,background:g?"rgba(93,202,165,.07)":"rgba(216,90,48,.07)",border:`0.5px solid ${cbd}`,padding:"3px 10px",borderRadius:4}}><i className={`ti ${g?"ti-check":"ti-alert-triangle"}`} style={{fontSize:12,marginRight:5,verticalAlign:"-1px"}} aria-hidden="true"/>{g?L.goodChoice:L.badChoice}</span></div><div style={{background:T.sf,border:`0.5px solid ${cbd}`,borderLeft:`3px solid ${clr}`,borderRadius:8,padding:"1.4rem 1.5rem",marginBottom:"1.5rem",lineHeight:1.85,fontSize:"0.92rem",whiteSpace:"pre-line",color:T.tx,fontFamily:"Georgia,serif"}}>{cons}</div><NBtn onClick={onContinue} T={T}>{(choice.branch||choice.branchEn)?L.continueBtn:L.conceptBtn}</NBtn></div>);}
function BranchScene({choice,lang,T,L,onContinue}){const branch=SC(choice,"branch",lang);return(<div><div style={{marginBottom:"1rem"}}><span style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:T.am,background:T.al,border:`0.5px solid ${T.ab}`,padding:"3px 10px",borderRadius:4}}><i className="ti ti-rotate" style={{fontSize:12,marginRight:5,verticalAlign:"-1px"}} aria-hidden="true"/>{L.branchTag}</span></div><div style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderLeft:`3px solid ${T.am}`,borderRadius:8,padding:"1.4rem 1.5rem",marginBottom:"1.5rem",lineHeight:1.85,fontSize:"0.92rem",whiteSpace:"pre-line",color:T.tx,fontFamily:"Georgia,serif"}}>{branch}</div><NBtn onClick={onContinue} T={T}>{L.conceptBtn}</NBtn></div>);}

// ── CONCEPT CARD ──────────────────────────────────────────────
function ConceptCard({scene,language,lang,T,L,onNext}){
  const c=scene.concept;const[tab,setTab]=useState("code");const[codeLang,setCodeLang]=useState(language==="js"?"js":"py");
  const[py,setPy]=useState(c.py);const[js,setJs]=useState(c.js);
  const curCode=codeLang==="py"?py:js;const setCode=codeLang==="py"?setPy:setJs;
  const nm=lang==="en"?(c.nmEn||c.nm):c.nm;const sm=lang==="en"?(c.sumEn||c.sum):c.sum;const hasAnim=!!ANIM_STEPS[scene.id];
  return(<div>
    <div style={{border:`0.5px solid ${c.bd}`,background:c.bg,borderRadius:8,padding:"1.5rem",marginBottom:"1.5rem"}}>
      <p style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:c.cl,marginBottom:"0.4rem"}}><i className="ti ti-bulb" style={{fontSize:13,marginRight:6,verticalAlign:"-1px"}} aria-hidden="true"/>{L.conceptLearned}</p>
      <h3 style={{fontSize:"1.2rem",fontWeight:"normal",color:T.tx,marginBottom:"0.85rem",fontFamily:"Georgia,serif"}}>{nm}</h3>
      <p style={{fontSize:"0.88rem",color:T.tx,lineHeight:1.78,marginBottom:"1.25rem",fontFamily:"Georgia,serif"}}>{sm}</p>
      <div style={{display:"flex",gap:6,marginBottom:"0.85rem"}}>
        {[["code",`</> ${L.codeTab}`],["anim",`▶ ${L.animTab}`]].map(([k,l])=>(<button key={k} onClick={()=>setTab(k)} disabled={k==="anim"&&!hasAnim} style={{background:tab===k?T.al:"transparent",border:`0.5px solid ${tab===k?T.am:T.ab}`,color:tab===k?T.am:T.mt,padding:"3px 12px",borderRadius:4,cursor:k==="anim"&&!hasAnim?"default":"pointer",fontSize:11,fontFamily:"Georgia,serif",opacity:k==="anim"&&!hasAnim?0.4:1}}>{l}</button>))}
      </div>
      {tab==="code"&&<div>
        <div style={{display:"flex",gap:6,marginBottom:8,alignItems:"center"}}>
          {(language==="both"?[["py","Python"],["js","JavaScript"]]:language==="js"?[["js","JavaScript"]]:[["py","Python"]]).map(([k,l])=>(<button key={k} onClick={()=>setCodeLang(k)} style={{background:codeLang===k?T.al:"transparent",border:`0.5px solid ${codeLang===k?T.am:T.ab}`,color:codeLang===k?T.am:T.mt,padding:"3px 12px",borderRadius:4,cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif"}}>{l}</button>))}
          <button onClick={()=>setCode(codeLang==="py"?c.py:c.js)} style={{marginLeft:"auto",background:"transparent",border:`0.5px solid ${T.ab}`,color:T.mt,padding:"3px 10px",borderRadius:4,cursor:"pointer",fontSize:10,fontFamily:"Georgia,serif"}}><i className="ti ti-refresh" style={{fontSize:10,marginRight:4}} aria-hidden="true"/>{L.resetCode}</button>
        </div>
        <textarea value={curCode} onChange={e=>setCode(e.target.value)} style={{width:"100%",background:T.cb,border:`0.5px solid rgba(239,159,39,.1)`,borderRadius:6,padding:"0.9rem 1.1rem",fontFamily:"Courier New,monospace",fontSize:"0.79rem",color:"#b8dfa0",lineHeight:1.78,resize:"vertical",minHeight:110,boxSizing:"border-box",outline:"none"}}/>
        <p style={{fontSize:11,color:T.mt,marginTop:5,fontFamily:"Georgia,serif"}}><i className="ti ti-pencil" style={{fontSize:10,marginRight:4}} aria-hidden="true"/>{L.editCode}</p>
      </div>}
      {tab==="anim"&&<CodeAnim sceneId={scene.id} lang={lang} T={T} L={L}/>}
    </div>
    <NBtn onClick={onNext} T={T}>{L.conceptNext}</NBtn>
  </div>);}

// ── QUIZ (AI-GENERATED DYNAMIC QUESTIONS) ────────────────────
async function generateQuizQuestion(scene, lang, attempt) {
  const nm = lang==="en"?(scene.concept?.nmEn||scene.concept?.nm||scene.id):scene.concept?.nm||scene.id;
  const sm = lang==="en"?(scene.concept?.sumEn||scene.concept?.sum||""):scene.concept?.sum||"";
  const seed = Math.floor(Math.random()*10000);
  const prompt = lang==="en"
    ? `Generate ONE multiple choice question about "${nm}" (${sm}). Seed: ${seed} — make it DIFFERENT each time, vary difficulty and angle. Return ONLY valid JSON (no markdown): {"q":"question text","opts":["A","B","C"],"ok":0} where ok is the index of the correct answer. Question must test understanding, not just memorization.`
    : `Gere UMA pergunta de múltipla escolha sobre "${nm}" (${sm}). Semente: ${seed} — faça DIFERENTE a cada vez, varie dificuldade e ângulo. Retorne SOMENTE JSON válido (sem markdown): {"q":"texto da pergunta","opts":["A","B","C"],"ok":0} onde ok é o índice da resposta correta. A pergunta deve testar compreensão, não só memorização.`;
  const resp = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,
      messages:[{role:"user",content:prompt}]})
  });
  const data = await resp.json();
  const text = data.content?.find(b=>b.type==="text")?.text||"";
  const clean = text.replace(/```json?|```/g,"").trim();
  const parsed = JSON.parse(clean);
  if(!parsed.q||!Array.isArray(parsed.opts)||parsed.opts.length<3||parsed.ok===undefined) throw new Error("bad format");
  return parsed;
}

function Quiz({scene,lang,isLast,T,L,onSubmit}){
  const cacheKey = `quiz_${scene.id}_${lang}`;
  const[loading,setLoading]=useState(false);
  const[questions,setQuestions]=useState([]);
  const[qIdx,setQIdx]=useState(0);
  const[sel,setSel]=useState(null);const[rev,setRev]=useState(false);
  const[correct,setCorrect]=useState(0);const[error,setError]=useState(false);

  // Generate a fresh batch of 3 questions on mount
  useEffect(()=>{
    let cancelled=false;
    const fallback={q:lang==="en"?(scene.quiz.qEn||scene.quiz.q):scene.quiz.q,opts:lang==="en"?(scene.quiz.optsEn||scene.quiz.opts):scene.quiz.opts,ok:scene.quiz.ok};
    setLoading(true);
    Promise.all([generateQuizQuestion(scene,lang,0),generateQuizQuestion(scene,lang,1),generateQuizQuestion(scene,lang,2)])
      .then(qs=>{if(!cancelled){setQuestions(qs);setLoading(false);}})
      .catch(()=>{if(!cancelled){setQuestions([fallback,fallback,fallback]);setLoading(false);setError(true);}});
    return()=>{cancelled=true;};
  },[scene.id]);

  if(loading||!questions.length) return(
    <div style={{padding:"2rem 0",textAlign:"center"}}>
      <i className="ti ti-brain" style={{fontSize:28,color:T.am,display:"block",marginBottom:"0.75rem",animation:"spin 1.2s linear infinite"}} aria-hidden="true"/>
      <p style={{fontSize:13,color:T.mt,fontFamily:"Georgia,serif"}}>{lang==="en"?"Generating unique questions...":"Gerando perguntas únicas..."}</p>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>);

  const q=questions[qIdx];const ok=sel===q.ok;
  const totalQ=questions.length;

  const handleNext=()=>{
    const wasOk=sel===q.ok;
    if(wasOk)setCorrect(c=>c+1);
    if(qIdx<totalQ-1){setQIdx(i=>i+1);setSel(null);setRev(false);}
    else{onSubmit(wasOk?q.ok:99,{correct:correct+(wasOk?1:0),total:totalQ});}
  };

  return(<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"}}>
      <p style={{fontSize:10,letterSpacing:3,color:T.am,textTransform:"uppercase",margin:0}}><i className="ti ti-help-circle" style={{fontSize:13,marginRight:6,verticalAlign:"-1px"}} aria-hidden="true"/>{L.quizTitle}</p>
      <div style={{display:"flex",gap:5}}>{questions.map((_,i)=>(<div key={i} style={{width:8,height:8,borderRadius:"50%",background:i<qIdx?"rgba(93,202,165,.6)":i===qIdx?T.am:T.ab,transition:"background 0.3s"}}/>))}</div>
    </div>
    <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:"1.25rem"}}>
      <span style={{fontSize:11,color:T.mt,flexShrink:0}}>{qIdx+1}/{totalQ}</span>
      <p style={{fontSize:"0.96rem",color:T.tx,margin:0,fontFamily:"Georgia,serif",lineHeight:1.7}}>{q.q}</p>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",marginBottom:"1rem"}}>
      {q.opts.map((opt,i)=>{
        let bd=T.ab,bg="transparent",tc=T.tx;
        if(rev){if(i===q.ok){bd="rgba(93,202,165,.5)";bg="rgba(93,202,165,.08)";tc=T.gn;}else if(i===sel){bd="rgba(216,90,48,.5)";bg="rgba(216,90,48,.08)";tc=T.cr;}}
        else if(i===sel){bd=T.am;bg=T.al;}
        return(<button key={i} onClick={()=>!rev&&setSel(i)} style={{background:bg,border:`0.5px solid ${bd}`,color:tc,padding:"0.75rem 1rem",textAlign:"left",cursor:rev?"default":"pointer",borderRadius:8,fontSize:"0.9rem",fontFamily:"Georgia,serif",lineHeight:1.5,transition:"all 0.2s"}}>
          {rev&&i===q.ok&&<i className="ti ti-check" style={{fontSize:12,marginRight:8,color:T.gn}} aria-hidden="true"/>}
          {rev&&i===sel&&i!==q.ok&&<i className="ti ti-x" style={{fontSize:12,marginRight:8,color:T.cr}} aria-hidden="true"/>}
          {opt}
        </button>);
      })}
    </div>
    {!rev
      ?<NBtn onClick={()=>sel!==null&&setRev(true)} disabled={sel===null} T={T}>{L.quizCheck}</NBtn>
      :<div>
        <p style={{fontSize:"0.88rem",color:ok?T.gn:T.mt,marginBottom:"1rem",fontFamily:"Georgia,serif"}}>{ok?L.quizRight:L.quizWrong}</p>
        <NBtn onClick={handleNext} T={T}>
          {qIdx<totalQ-1?(lang==="en"?"Next question →":"Próxima pergunta →"):(isLast?L.quizFinal:L.quizNextCh)}
        </NBtn>
      </div>}
    {error&&<p style={{fontSize:10,color:T.mt,marginTop:"0.5rem",fontFamily:"Georgia,serif"}}>{lang==="en"?"Using fallback questions (offline mode)":"Usando perguntas de fallback (modo offline)"}</p>}
  </div>);}

// ── GLOSSARY ──────────────────────────────────────────────────
function Glossary({learned,lang,open,onToggle,T,L}){
  const[search,setSearch]=useState("");
  const filtered=learned.filter(c=>{const nm=lang==="en"?(c.nmEn||c.nm):c.nm;return!search||nm.toLowerCase().includes(search.toLowerCase());});
  return(<div style={{borderTop:`0.5px solid ${T.ab}`,marginTop:"1.5rem"}}>
    <button onClick={onToggle} style={{width:"100%",background:"transparent",border:"none",color:T.mt,padding:"0.75rem 0",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontSize:12,fontFamily:"Georgia,serif",letterSpacing:1}}>
      <i className="ti ti-book" style={{fontSize:14,color:T.am}} aria-hidden="true"/>{L.grimoire} ({learned.length} {L.grimoireConcepts})
      <i className={`ti ${open?"ti-chevron-up":"ti-chevron-down"}`} style={{fontSize:12,marginLeft:"auto"}} aria-hidden="true"/>
    </button>
    {open&&<div style={{paddingBottom:"1.5rem"}}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={L.glossarySearch} style={{width:"100%",background:T.sf,border:`0.5px solid ${T.ab}`,color:T.tx,padding:"6px 10px",borderRadius:6,fontSize:12,fontFamily:"Georgia,serif",outline:"none",marginBottom:"0.75rem",boxSizing:"border-box"}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:8}}>
        {filtered.map((c,i)=>{const nm=lang==="en"?(c.nmEn||c.nm):c.nm;const sm=lang==="en"?(c.sumEn||c.sum):c.sum;return(<div key={i} style={{background:T.sf,border:`0.5px solid ${T.ab}`,borderRadius:8,padding:"0.75rem"}}><div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:c.cl,marginBottom:4}}>{nm}</div><div style={{fontSize:12,color:T.mt,lineHeight:1.6}}>{sm}</div></div>);})}
        {!filtered.length&&<p style={{fontSize:13,color:T.mt,fontFamily:"Georgia,serif"}}>{search?`Nenhum resultado para "${search}"`:(L.grimoireEmpty)}</p>}
      </div>
    </div>}
  </div>);}

// ── END ───────────────────────────────────────────────────────
function End({players,currentP,mode,T,L,lang,learned,errors,isAllDone,onRestart,onProfile,onLB,onChapters,onReview,onCert,onInfinite}){
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
      {isAllDone&&<NBtn onClick={onCert} T={T}><i className="ti ti-certificate" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.endCert}</NBtn>}
      {isAllDone&&<NBtn onClick={onInfinite} T={T}><i className="ti ti-infinity" style={{fontSize:12,marginRight:5}} aria-hidden="true"/>{L.endInfinite}</NBtn>}
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}><NBtn onClick={onRestart} T={T}>{L.endReplay}</NBtn><NBtn onClick={onChapters} T={T}>{L.endMap}</NBtn></div>
    <p style={{fontSize:12,color:T.mt,marginTop:"1.5rem",fontFamily:"Georgia,serif"}}>{L.endContinue}</p>
  </div>);}

// ── MAIN APP ──────────────────────────────────────────────────
function AppInner(){
  const[settings,setSettings]=useState(()=>{try{return JSON.parse(localStorage.getItem("tdc_save")||"{}");}catch{return{};}});
  const getSetting=(k,def)=>settings[k]!==undefined?settings[k]:def;
  const theme=getSetting("theme","dark");const difficulty=getSetting("difficulty","iniciante");
  const language=getSetting("language","py");const lang=getSetting("lang","pt");
  const career=getSetting("career","all");
  const T=TH[theme]||TH.dark;const L=UI[lang]||UI.pt;

  // Active scenes based on career path
  const careerIndices=CAREER_PATHS[career]?.indices||CAREER_PATHS.all.indices;
  const activeScenes=careerIndices.map(i=>SCENES[i]).filter(Boolean);

  // Core game state
  const[phase,setPhase]=useState("welcome");
  const[sceneIdx,setSceneIdx]=useState(0);const[subPhase,setSubPhase]=useState("reading");
  const[choiceIdx,setChoiceIdx]=useState(null);
  const[players,setPlayers]=useState([{name:"Byte",score:0},{name:"P2",score:0}]);
  const[currentPlayer,setCurrentPlayer]=useState(0);const[mode,setMode]=useState("solo");
  const[quizWrong,setQuizWrong]=useState([]);
  const[learned,setLearned]=useState([]);
  const[inventory,setInventory]=useState(()=>{try{return JSON.parse(localStorage.getItem("tdc_inv")||"[]");}catch{return[];}});
  const[unlocked,setUnlocked]=useState(()=>{try{return JSON.parse(localStorage.getItem("tdc_ach")||"[]");}catch{return[];}});
  const[xp,setXp]=useState(()=>{try{return parseInt(localStorage.getItem("tdc_xp")||"0");}catch{return 0;}});
  const[streak,setStreak]=useState(()=>{try{return parseInt(localStorage.getItem("tdc_streak")||"0");}catch{return 0;}});
  const[pendingBoss,setPendingBoss]=useState(null);
  const[glossOpen,setGlossOpen]=useState(false);
  const[achToast,setAchToast]=useState(null);
  const[hintLevel,setHintLevel]=useState(0);
  const[timerSecs,setTimerSecs]=useState(30);const timerRef=useRef(null);
  const[isSpeed,setIsSpeed]=useState(false);

  // New v6 state
  const[welcomeSeen,setWelcomeSeen]=useState(()=>!!localStorage.getItem("tdc_welcome"));
  const[tournamentScenes,setTournamentScenes]=useState([]);
  const[tournamentIdx,setTournamentIdx]=useState(0);const[isTournament,setIsTournament]=useState(false);
  const[tournamentScore,setTournamentScore]=useState(0);
  const[isInfinite,setIsInfinite]=useState(false);
  const[bonusQuizDone,setBonusQuizDone]=useState(false);
  const[pendingStreakReward,setPendingStreakReward]=useState(null);
  const[musicEnabled,setMusicEnabled]=useState(true);
  const[hearts,setHearts]=useState(()=>{try{const v=localStorage.getItem("tdc_hearts");const ts=localStorage.getItem("tdc_hearts_ts");if(v&&ts){const el=(Date.now()-parseInt(ts))/3600000;const rec=Math.min(Math.floor(el),5-parseInt(v));return Math.min(5,parseInt(v)+rec);}return 5;}catch{return 5;}});
  const MAX_HEARTS=5;
  const[gems,setGems]=useState(()=>{try{return parseInt(localStorage.getItem("tdc_gems")||"0");}catch{return 0;}});
  const[weeklyXP,setWeeklyXP]=useState(()=>{try{const wk=localStorage.getItem("tdc_weekly_week");const now=new Date();const day=now.getDay();const diff=now.getDate()-day+(day===0?-6:1);const mon=new Date(now.getFullYear(),now.getMonth(),diff);const key=mon.toDateString();if(wk!==key){localStorage.setItem("tdc_weekly_week",key);localStorage.setItem("tdc_weekly_xp","0");return 0;}return parseInt(localStorage.getItem("tdc_weekly_xp")||"0");}catch{return 0;}});
  const[dailyXP,setDailyXP]=useState(()=>{try{const dk=localStorage.getItem("tdc_daily_date");const now=new Date().toDateString();if(dk!==now){localStorage.setItem("tdc_daily_date",now);localStorage.setItem("tdc_daily_xp","0");return 0;}return parseInt(localStorage.getItem("tdc_daily_xp")||"0");}catch{return 0;}});
  const[heartLost,setHeartLost]=useState(false);
  const[bytState,setBytState]=useState(null);
  const[particles,setParticles]=useState([]);
  const[sessionHistory,setSessionHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem("tdc_sessions")||"[]");}catch{return[];}});

  useAmbientMusic(musicEnabled, phase==="boss");

  // Persist settings
  useEffect(()=>{try{localStorage.setItem("tdc_save",JSON.stringify(settings));}catch{}},[settings]);

  // Particle CSS injection
  useEffect(()=>{
    const style=document.createElement("style");
    style.textContent=`@keyframes particleUp{0%{opacity:1;transform:translateY(0) scale(1);}100%{opacity:0;transform:translateY(-60px) scale(0.3);}}@keyframes bossGlow{0%,100%{box-shadow:inset 0 0 0 2px rgba(216,90,48,.4);}50%{box-shadow:inset 0 0 0 3px rgba(216,90,48,.9),0 0 20px rgba(216,90,48,.2);}}`;
    document.head.appendChild(style);
    return()=>document.head.removeChild(style);
  },[]);

  const spawnParticles=useCallback((pts)=>{if(pts<=0)return;const base={x:window.innerWidth/2-30,y:window.innerHeight/2};const newP=Array.from({length:6},(_,i)=>({id:Date.now()+i,x:base.x+Math.random()*60-30,y:base.y+Math.random()*40-20,angle:Math.random()*360}));setParticles(p=>[...p,...newP]);setTimeout(()=>setParticles([]),800);},[]);

  const addGems=useCallback((n)=>{setGems(g=>{const ng=g+n;try{localStorage.setItem("tdc_gems",String(ng));}catch{}return ng;});},[]);
  const spendGems=useCallback((n)=>{setGems(g=>{const ng=Math.max(0,g-n);try{localStorage.setItem("tdc_gems",String(ng));}catch{}return ng;});},[]);
  const loseHeart=useCallback(()=>{setHearts(h=>{const nh=Math.max(0,h-1);try{localStorage.setItem("tdc_hearts",String(nh));localStorage.setItem("tdc_hearts_ts",String(Date.now()));}catch{}return nh;});setHeartLost(true);},[]);
  const addXP=useCallback((amt)=>{
    setXp(p=>{const nv=p+amt;try{localStorage.setItem("tdc_xp",String(nv));}catch{}return nv;});
    setWeeklyXP(w=>{const nw=w+amt;try{localStorage.setItem("tdc_weekly_xp",String(nw));}catch{}return nw;});
    setDailyXP(d=>{const nd=d+amt;try{localStorage.setItem("tdc_daily_xp",String(nd));}catch{}return nd;});
    spawnParticles(amt);
  },[spawnParticles]);
  const addScore=useCallback((pts,playerIdx=null)=>{const pi=playerIdx!==null?playerIdx:currentPlayer;setPlayers(p=>{const np=[...p];np[pi]={...np[pi],score:np[pi].score+pts};return np;});if(pts>0){addXP(pts);spawnParticles(pts);}},[ currentPlayer,addXP,spawnParticles]);

  const achieve=useCallback((id)=>{if(unlocked.includes(id))return;const idx=ACH_IDS.indexOf(id);if(idx<0)return;setUnlocked(u=>{const nu=[...u,id];try{localStorage.setItem("tdc_ach",JSON.stringify(nu));}catch{}return nu;});const nm=L.ach[idx]||{nm:id,desc:""};setAchToast({icon:ACH_ICONS[idx],nm:nm.nm,desc:nm.desc});setTimeout(()=>setAchToast(null),3500);},[unlocked,L]);

  const saveSession=useCallback((finalScore)=>{
    const rec={score:finalScore,date:Date.now()};
    setSessionHistory(h=>{const nh=[...h,rec];try{localStorage.setItem("tdc_sessions",JSON.stringify(nh));}catch{}return nh;});
  },[]);

  // Streak tracking
  const updateStreak=useCallback(()=>{
    try{
      const today=new Date().toDateString();
      const last=localStorage.getItem("tdc_streak_date");
      const yesterday=new Date(Date.now()-86400000).toDateString();
      let s=parseInt(localStorage.getItem("tdc_streak")||"0");
      if(last===today)return s;
      if(last===yesterday)s++;else s=1;
      localStorage.setItem("tdc_streak",String(s));
      localStorage.setItem("tdc_streak_date",today);
      setStreak(s);
      // Check milestones
      const claimed=JSON.parse(localStorage.getItem("tdc_streak_claimed")||"[]");
      const milestones=[{days:3,xp:50},{days:7,xp:150},{days:30,xp:500}];
      for(const m of milestones){if(s>=m.days&&!claimed.includes(m.days)){claimed.push(m.days);localStorage.setItem("tdc_streak_claimed",JSON.stringify(claimed));setPendingStreakReward(m);break;}}
      return s;
    }catch{return streak;}
  },[streak]);

  const getScene=()=>isTournament?tournamentScenes[tournamentIdx]:isInfinite?SCENES[sceneIdx]:activeScenes[sceneIdx];

  const startGame=(scIdx=0,gameMode="solo",sp=false,tournament=false,scenes=null)=>{
    setMode(gameMode);setIsSpeed(sp);setIsTournament(tournament);
    if(tournament&&scenes){setTournamentScenes(scenes);setTournamentIdx(0);setTournamentScore(0);}
    const s=parseInt(localStorage.getItem("tdc_xp")||"0");setXp(s);
    const sName=settings.p1||"Byte";const s2Name=settings.p2||"Jogador 2";
    setPlayers([{name:sName,score:0},{name:s2Name,score:0}]);
    setCurrentPlayer(0);setSceneIdx(scIdx);setSubPhase("reading");setChoiceIdx(null);setQuizWrong([]);setLearned([]);setPendingBoss(null);setHintLevel(0);setBonusQuizDone(false);setGlossOpen(false);
    if(sp){setTimerSecs(30);if(timerRef.current)clearInterval(timerRef.current);timerRef.current=setInterval(()=>setTimerSecs(t=>{if(t<=1){clearInterval(timerRef.current);nextScene();return 0;}return t-1;}),1000);}
    const newStreak=updateStreak();
    if(pendingStreakReward){setPhase("streak-reward");}
    else{setPhase("game");}
    achieve("first_good");
    if(gameMode==="multi")achieve("multi");
    if(gameMode==="daily")achieve("daily");
  };

  const nextScene=useCallback(()=>{
    const scenes=isTournament?tournamentScenes:isInfinite?SCENES:activeScenes;
    const idx=isTournament?tournamentIdx:sceneIdx;
    const boss=BOSSES.find(b=>b.afterIdx===idx);
    if(boss&&!pendingBoss){setPendingBoss(boss);setSubPhase("boss");return;}
    const nextIdx=isTournament?tournamentIdx+1:sceneIdx+1;
    if(isTournament){
      if(nextIdx>=tournamentScenes.length){
        const finalScore=players[0].score+(isTournament?0:0);
        setTournamentScore(players[0].score);
        setPhase("tournament-end");return;
      }
      setTournamentIdx(nextIdx);
    } else if(isInfinite){
      const ri=Math.floor(Math.random()*SCENES.length);
      setSceneIdx(ri);
      achieve("infinite_start");
    } else {
      if(nextIdx>=activeScenes.length){
        // Save to leaderboard
        const finalScore=players[currentPlayer].score;
        try{const lb=JSON.parse(localStorage.getItem("tdc_lb")||"[]");lb.push({name:players[currentPlayer].name,score:finalScore,mode,date:Date.now()});lb.sort((a,b)=>b.score-a.score);localStorage.setItem("tdc_lb",JSON.stringify(lb.slice(0,20)));}catch{}
        saveSession(finalScore);
        if(mode==="multi"&&currentPlayer===0){setCurrentPlayer(1);setSubPhase("reading");setSceneIdx(0);setChoiceIdx(null);setQuizWrong([]);setHintLevel(0);setBonusQuizDone(false);setPhase("switch");return;}
        if(inventory.length+1>=activeScenes.length)achieve("all_chapters");
        setPhase("end");return;
      }
      setSceneIdx(nextIdx);
    }
    setSubPhase("reading");setChoiceIdx(null);setHintLevel(0);setBonusQuizDone(false);
    if(isSpeed){setTimerSecs(30);}
  },[isTournament,isInfinite,tournamentIdx,tournamentScenes,sceneIdx,activeScenes,pendingBoss,players,currentPlayer,mode,inventory,saveSession,achieve,isSpeed]);

  const handleChoice=(idx)=>{
    const scene=getScene();const choice=scene.choices[idx];
    setChoiceIdx(idx);
    if(choice.good){addScore(10);achieve("first_good");setBytState({msg:bytMsg("correct",lang),mood:"correct"});}
    else{loseHeart();setBytState({msg:bytMsg("wrong",lang),mood:"wrong"});}
    setSubPhase("chosen");
  };

  const handleQuizSubmit=(sel,stats)=>{
    const scene=getScene();
    // stats can be {correct, total} from dynamic quiz, or undefined for fallback
    const totalCorrect=stats?.correct??( sel===scene.quiz.ok?1:0 );
    const totalQ=stats?.total??1;
    const ok=totalCorrect>0;
    if(ok){addScore(isTournament?(totalCorrect*10):(totalCorrect*5));if(!quizWrong.length&&totalCorrect===totalQ)achieve("flawless");setBytState({msg:bytMsg("correct",lang),mood:"correct"});}
    else{setQuizWrong(w=>[...w,{...scene,chosen:sel}]);loseHeart();setBytState({msg:bytMsg("wrong",lang),mood:"wrong"});}
    if(!bonusQuizDone&&BONUS_QUIZ[scene.id]?.length){setSubPhase("bonus-quiz");}
    else{afterQuiz(scene,ok);}
  };

  const afterQuiz=(scene,ok)=>{
    const item=scene.item;
    if(item){const existing=inventory.find(i=>i.id===scene.id);if(!existing){const ni=[...inventory,{id:scene.id,...item}];setInventory(ni);try{localStorage.setItem("tdc_inv",JSON.stringify(ni));}catch{}}}
    if(!learned.find(l=>l.id===scene.id)&&scene.concept){setLearned(l=>[...l,{id:scene.id,...scene.concept}]);}
    if(inventory.length>=5)achieve("collector");
    addGems(5);
    nextScene();
  };

  const handleHint=(level)=>{
    setHintLevel(level);
    if(level>=2)addScore(-2);
    if(level>=3)addScore(-3);
    if(level===1)achieve("no_hints");
  };

  // Infinite mode pick random scene
  const startInfinite=()=>{
    setIsInfinite(true);setIsTournament(false);
    const ri=Math.floor(Math.random()*SCENES.length);
    setSceneIdx(ri);setSubPhase("reading");setChoiceIdx(null);setHintLevel(0);setBonusQuizDone(false);
    setPhase("game");achieve("infinite_start");
  };

  const scene=phase==="game"?getScene():null;
  const isBossPhase=subPhase==="boss";
  const isAllDone=!isTournament&&!isInfinite&&(sceneIdx>=activeScenes.length-1||phase==="end");

  const containerStyle={
    minHeight:"100vh",background:T.bg,color:T.tx,padding:"1.25rem",
    maxWidth:680,margin:"0 auto",position:"relative",
    ...(isBossPhase?{animation:"bossGlow 1.8s ease-in-out infinite"}:{}),
  };

  // Header
  const xpData=getLevel(xp);
  const dlGoalId3=settings.dailyGoal||"regular";const dlGoalPts3=DAILY_GOALS.find(g=>g.id===dlGoalId3)?.pts||20;
  const renderHeader=()=>phase==="game"||phase==="end"?(
    <div style={{marginBottom:"1rem"}}>
      <XPBar xpData={xpData} lang={lang} T={T} L={L}/>
      <DailyGoalBar dailyXP={dailyXP} dailyGoalPts={dlGoalPts3} lang={lang} T={T} L={L}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <ProgBar idx={isTournament?tournamentIdx:isInfinite?sceneIdx%SCENES.length:sceneIdx} total={isTournament?tournamentScenes.length:isInfinite?SCENES.length:activeScenes.length} T={T}/>
        <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:8,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <HeartsDisplay hearts={hearts} maxHearts={MAX_HEARTS} T={T}/>
            <button onClick={()=>setPhase("gem-shop")} style={{background:"none",border:"none",cursor:"pointer",padding:0}}><GemsDisplay gems={gems} T={T}/></button>
            <span style={{fontSize:13,fontWeight:500,color:T.am}}>{players[currentPlayer].score} {L.pts}</span>
          </div>
          {isTournament&&<span style={{fontSize:10,background:"rgba(216,90,48,.12)",border:"0.5px solid rgba(216,90,48,.35)",color:T.cr,padding:"2px 8px",borderRadius:4}}>×2</span>}
          {isInfinite&&<span style={{fontSize:10,background:T.al,border:`0.5px solid ${T.ab}`,color:T.am,padding:"2px 8px",borderRadius:4}}>∞</span>}
          <button onClick={()=>setMusicEnabled(m=>!m)} title="Toggle music" style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:14,padding:"2px 5px"}}>{musicEnabled?L.musicOn:L.musicOff}</button>
          <button onClick={()=>{if(confirm(lang==="en"?"Restart game?":"Reiniciar o jogo?")){setPhase("intro");setSceneIdx(0);setSubPhase("reading");setChoiceIdx(null);setQuizWrong([]);setHintLevel(0);setBonusQuizDone(false);setPlayers(p=>p.map(x=>({...x,score:0})));setIsTournament(false);setIsInfinite(false);}}} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:16,padding:"2px 5px"}} title={lang==="en"?"Restart":"Reiniciar"}>↺</button>
          <button onClick={()=>setPhase("map")} style={{background:"transparent",border:"none",color:T.mt,cursor:"pointer",fontSize:13,padding:"2px 5px"}} title={L.mapTitle}><i className="ti ti-map-2" style={{fontSize:14}} aria-hidden="true"/></button>
        </div>
      </div>
    </div>
  ):null;

  // ── PHASE ROUTER ──────────────────────────────────────────────
  if(phase==="welcome"&&!welcomeSeen){
    return(<div style={containerStyle}><WelcomeScreen lang={lang} T={T} L={L} onStart={()=>{localStorage.setItem("tdc_welcome","1");setWelcomeSeen(true);setPhase("intro");}}/><Particles particles={particles} T={T}/></div>);
  }
  if(phase==="welcome"||phase==="intro"){
    const dlGoalId=settings.dailyGoal||"regular";const dlGoalPts=DAILY_GOALS.find(g=>g.id===dlGoalId)?.pts||20;
    return(<div style={containerStyle}>
      <SkillPath scenes={activeScenes} inventory={inventory} sceneIdx={sceneIdx} lang={lang} T={T} L={L}
        onPickScene={(idx)=>{setSceneIdx(idx);}}
        onStartLesson={(idx)=>{startGame(idx,"solo",false);}}
        dailyXP={dailyXP} dailyGoalPts={dlGoalPts} hearts={hearts} maxHearts={MAX_HEARTS} gems={gems}
        weeklyXP={weeklyXP} streak={streak} xpData={xpData} settings={settings} setSettings={setSettings}
        onMulti={()=>setPhase("multi-setup")} onTournament={()=>setPhase("tournament-setup")} onLeagues={()=>setPhase("leagues")} onGemShop={()=>setPhase("gem-shop")}/>
      <Glossary learned={learned} lang={lang} open={glossOpen} onToggle={()=>setGlossOpen(g=>!g)} T={T} L={L}/>
      <Particles particles={particles} T={T}/>{achToast&&<AchToast ach={achToast} T={T} onClose={()=>setAchToast(null)}/>}
    </div>);
  }
  if(phase==="multi-setup"){return(<div style={containerStyle}><MultiSetup T={T} L={L} settings={settings} setSettings={setSettings} onStart={()=>startGame(0,"multi",false)} onBack={()=>setPhase("intro")}/></div>);}
  if(phase==="tournament-setup"){return(<div style={containerStyle}><TournamentSetup T={T} L={L} lang={lang} allScenes={SCENES} career={career} onStart={(scenes)=>startGame(0,"tournament",false,true,scenes)} onBack={()=>setPhase("intro")}/></div>);}
  if(phase==="chapter-pick"){return(<div style={containerStyle}><ChapterPicker scenes={activeScenes} inventory={inventory} T={T} L={L} lang={lang} onPick={(idx)=>{startGame(idx,"solo",false);}} onBack={()=>setPhase("intro")}/></div>);}
  if(phase==="tournament-end"){return(<div style={containerStyle}><TournamentEnd score={players[0].score} maxScore={tournamentScenes.length*15} T={T} L={L} onBack={()=>setPhase("intro")} onRestart={()=>setPhase("tournament-setup")}/><Particles particles={particles} T={T}/></div>);}
  if(phase==="streak-reward"&&pendingStreakReward){return(<div style={containerStyle}><StreakRewardScreen reward={pendingStreakReward} lang={lang} T={T} L={L} addXP={addXP} onClaim={()=>{setPendingStreakReward(null);setPhase("game");}}/><Particles particles={particles} T={T}/></div>);}
  if(phase==="switch"){return(<div style={containerStyle}><PlayerSwitch next={players[1].name} score={players[0].score} T={T} L={L} onContinue={()=>{setSubPhase("reading");setPhase("game");}}/></div>);}
  if(phase==="map"){return(<div style={containerStyle}><MapScreen scenes={activeScenes} inventory={inventory} onJump={(idx)=>{setSceneIdx(idx);setSubPhase("reading");setChoiceIdx(null);setHintLevel(0);setBonusQuizDone(false);setPhase("game");}} onBack={()=>setPhase(players[currentPlayer].score>0?"end":"intro")} T={T} L={L}/></div>);}
  if(phase==="achievements"){return(<div style={containerStyle}><AchScreen unlocked={unlocked} T={T} L={L} onBack={()=>setPhase("end")}/></div>);}
  if(phase==="leaderboard"){return(<div style={containerStyle}><LeaderBoard playerName={players[currentPlayer].name} T={T} L={L} onBack={()=>setPhase("end")}/></div>);}
  if(phase==="profile"){
    const ri=Math.round((players[currentPlayer].score/(activeScenes.length*15))*100)>=90?0:Math.round((players[currentPlayer].score/(activeScenes.length*15))*100)>=70?1:Math.round((players[currentPlayer].score/(activeScenes.length*15))*100)>=50?2:3;
    return(<div style={containerStyle}><ProfileScreen name={players[currentPlayer].name} score={players[currentPlayer].score} maxScore={activeScenes.length*15} learned={learned} unlocked={unlocked} inventory={inventory} difficulty={difficulty} mode={mode} xpData={xpData} streak={streak} T={T} L={L} lang={lang} onBack={()=>setPhase("end")} onCert={()=>setPhase("certificate")} onHistory={()=>setPhase("session-history")} onFriend={()=>setPhase("friend-compare")}/></div>);
  }
  if(phase==="certificate"){
    const ri2=Math.round((players[currentPlayer].score/(activeScenes.length*15))*100)>=90?0:Math.round((players[currentPlayer].score/(activeScenes.length*15))*100)>=70?1:Math.round((players[currentPlayer].score/(activeScenes.length*15))*100)>=50?2:3;
    return(<div style={containerStyle}><CertificateScreen name={players[currentPlayer].name} rank={L.ranks[ri2]} score={players[currentPlayer].score} learned={learned} unlocked={unlocked} lang={lang} T={T} L={L} onBack={()=>setPhase("profile")}/></div>);
  }
  if(phase==="session-history"){return(<div style={containerStyle}><SessionHistory sessions={sessionHistory} T={T} L={L} onClose={()=>setPhase("profile")}/></div>);}
  if(phase==="friend-compare"){
    const ri3=Math.round((players[currentPlayer].score/(activeScenes.length*15))*100)>=90?0:3;
    return(<div style={containerStyle}><FriendCompare name={players[currentPlayer].name} score={players[currentPlayer].score} rank={L.ranks[ri3]} learned={learned} lang={lang} T={T} L={L} onClose={()=>setPhase("profile")}/></div>);
  }
  if(phase==="review"){return(<div style={containerStyle}><ReviewErrors errors={quizWrong} lang={lang} T={T} L={L} onClose={()=>setPhase("end")}/></div>);}
  if(phase==="end"){
    return(<div style={containerStyle}>{renderHeader()}<End players={players} currentP={currentPlayer} mode={mode} T={T} L={L} lang={lang} learned={learned} errors={quizWrong} isAllDone={isAllDone||learned.length>=activeScenes.length} onRestart={()=>{setPhase("intro");}} onProfile={()=>setPhase("profile")} onLB={()=>setPhase("leaderboard")} onChapters={()=>setPhase("map")} onReview={()=>setPhase("review")} onCert={()=>setPhase("certificate")} onInfinite={startInfinite}/><Glossary learned={learned} lang={lang} open={glossOpen} onToggle={()=>setGlossOpen(g=>!g)} T={T} L={L}/><Particles particles={particles} T={T}/>{achToast&&<AchToast ach={achToast} T={T} onClose={()=>setAchToast(null)}/>}</div>);
  }
  if(phase==="leagues"){return(<div style={containerStyle}><LeaguesScreen weeklyXP={weeklyXP} lang={lang} T={T} onBack={()=>setPhase("intro")}/></div>);}
  if(phase==="gem-shop"){return(<div style={containerStyle}><GemShop gems={gems} hearts={hearts} maxHearts={MAX_HEARTS} lang={lang} T={T} onBuy={(item)=>{if(gems<item.cost)return;spendGems(item.cost);if(item.id==="heart1")setHearts(h=>Math.min(MAX_HEARTS,h+1));if(item.id==="heart5")setHearts(MAX_HEARTS);setBytState({msg:bytMsg("gems",lang),mood:"correct"});}} onClose={()=>setPhase("intro")}/><Particles particles={particles} T={T}/></div>);}
  if(phase!=="game"||!scene)return(<div style={containerStyle}><NBtn onClick={()=>setPhase("intro")} T={T}>← {L.back}</NBtn></div>);

  return(
    <div style={containerStyle}>
      {renderHeader()}
      {subPhase==="reading"&&<Reading scene={scene} difficulty={difficulty} lang={lang} hintLevel={hintLevel} onHint={handleHint} onPick={handleChoice} T={T} L={L} hintCost={L.hintCost} timerSecs={timerSecs} timerMax={30} isSpeed={isSpeed}/>}
      {subPhase==="chosen"&&choiceIdx!==null&&<Chosen choice={scene.choices[choiceIdx]} lang={lang} T={T} L={L} onContinue={()=>{const ch=scene.choices[choiceIdx];setSubPhase(ch.branch||ch.branchEn?"branch":"concept");}}/>}
      {subPhase==="branch"&&choiceIdx!==null&&<BranchScene choice={scene.choices[choiceIdx]} lang={lang} T={T} L={L} onContinue={()=>setSubPhase("concept")}/>}
      {subPhase==="concept"&&<ConceptCard scene={scene} language={language} lang={lang} T={T} L={L} onNext={()=>{if(language==="both")achieve("polyglot");setSubPhase("fixbug");}}/>}
      {subPhase==="fixbug"&&<FixBug scene={scene} T={T} L={L} onNext={()=>setSubPhase("sandbox")} addScore={addScore} onAchieve={achieve}/>}
      {subPhase==="sandbox"&&<Sandbox scene={scene} language={language} T={T} L={L} onNext={()=>setSubPhase("quiz")} onAchieve={achieve}/>}
      {subPhase==="boss"&&pendingBoss&&<BossChallenge boss={pendingBoss} lang={lang} T={T} L={L} onDone={(pts)=>{addScore(pts);achieve("boss_slayer");setPendingBoss(null);setSubPhase("reading");}} addXP={addXP}/>}
      {subPhase==="quiz"&&<Quiz scene={scene} lang={lang} isLast={isTournament?tournamentIdx>=tournamentScenes.length-1:isInfinite?false:sceneIdx>=activeScenes.length-1} T={T} L={L} onSubmit={handleQuizSubmit}/>}
      {subPhase==="bonus-quiz"&&<BonusQuiz sceneId={scene.id} lang={lang} T={T} L={L} addScore={addScore} onDone={()=>{setBonusQuizDone(true);afterQuiz(scene,false);}}/>}
      {heartLost&&<HeartLostModal hearts={hearts} maxHearts={MAX_HEARTS} gems={gems} lang={lang} T={T} L={L}
        onGemRefill={()=>{if(gems>=10){spendGems(10);setHearts(h=>Math.min(MAX_HEARTS,h+1));setHeartLost(false);setBytState({msg:bytMsg("gems",lang),mood:"correct"});}}}
        onContinue={()=>setHeartLost(false)}/>}
      {bytState&&!heartLost&&<BytMascot msg={bytState.msg} mood={bytState.mood} T={T} onClose={()=>setBytState(null)}/>}
      <Glossary learned={learned} lang={lang} open={glossOpen} onToggle={()=>setGlossOpen(g=>!g)} T={T} L={L}/>
      <Particles particles={particles} T={T}/>
      {achToast&&<AchToast ach={achToast} T={T} onClose={()=>setAchToast(null)}/>}
    </div>
  );

}
export default function App(){return(<ErrorBoundary><AppInner/></ErrorBoundary>);}
