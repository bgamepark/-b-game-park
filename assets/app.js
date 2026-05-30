
(function(){
  const game = (window.GAMES || []).find(g => g.id === window.GAME_ID);
  const root = document.getElementById("gameRoot");
  if(!game || !root){
    if(root) root.innerHTML = "<p>ゲームが見つかりません。</p>";
    return;
  }

  function storageKey(suffix){ return "bgamepark_" + game.id + "_" + suffix; }
  function rand(n){ return Math.floor(Math.random()*n); }
  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function sample(arr){ return arr[rand(arr.length)]; }
  function setHTML(html){ root.innerHTML = html; }
  function fmt(n){ return Number(n).toFixed(2); }
  function base(titleExtra=""){
    return `
      <h1 class="play-title">${game.title}</h1>
      <p class="play-desc">${game.desc}</p>
      ${titleExtra}
      <div class="result" id="result">スタートを押してください。</div>
      <div class="small-note" id="best"></div>
    `;
  }
  function updateBest(score, mode="high"){
    const key = storageKey("best");
    const current = localStorage.getItem(key);
    let changed = false;
    if(current === null){ changed = true; }
    else if(mode === "low" && Number(score) < Number(current)){ changed = true; }
    else if(mode === "high" && Number(score) > Number(current)){ changed = true; }
    if(changed) localStorage.setItem(key, String(score));
  }
  function bestText(label="ベスト", unit="点", mode="high"){
    const val = localStorage.getItem(storageKey("best"));
    return val === null ? `${label}：まだありません` : `${label}：${mode==="low" ? Number(val).toFixed(2) : val}${unit}`;
  }

  const engines = {};

  engines.timerStop = function(){
    setHTML(`
      <h1 class="play-title">${game.title}</h1>
      <p class="play-desc">${game.desc}</p>
      <div class="status-row">
        <div class="status-box">目標<strong>${fmt(game.target)}秒</strong></div>
        <div class="status-box">記録<strong id="stat">-</strong></div>
        <div class="status-box">差<strong id="diff">-</strong></div>
      </div>
      <div class="stage">
        <div class="big" id="timer">0.00</div>
        <div class="hint">目標時間に近いところで止めてください。</div>
      </div>
      <div class="btn-row">
        <button id="main">スタート</button>
        <button id="reset" class="secondary">リセット</button>
      </div>
      <div class="result" id="result">スタートを押してください。</div>
      <div class="small-note" id="best">${bestText("ベスト差","秒","low")}</div>
    `);
    let running=false, start=0, id=null;
    const timer = document.getElementById("timer");
    const main = document.getElementById("main");
    const result = document.getElementById("result");
    const stat = document.getElementById("stat");
    const diffEl = document.getElementById("diff");
    const best = document.getElementById("best");
    function reset(){
      running=false; clearInterval(id);
      timer.textContent="0.00"; stat.textContent="-"; diffEl.textContent="-";
      main.textContent="スタート"; result.textContent="スタートを押してください。";
    }
    main.onclick = function(){
      if(!running){
        running=true; start=performance.now(); main.textContent="ストップ"; result.textContent="今です、と思ったらストップ。";
        id=setInterval(()=>{ timer.textContent = fmt((performance.now()-start)/1000); }, 16);
      }else{
        running=false; clearInterval(id);
        const t=(performance.now()-start)/1000;
        const d=Math.abs(t-game.target);
        const score=Math.max(0, Math.round(1000 - d*1000));
        timer.textContent=fmt(t); stat.textContent=fmt(t); diffEl.textContent=fmt(d);
        let msg = d <= .03 ? "ほぼ完璧です。" : d <= .1 ? "かなり惜しいです。" : d <= .3 ? "いい感じです。" : "もう一回いきましょう。";
        result.innerHTML = `${msg}<br>スコア：${score}点`;
        updateBest(d, "low"); best.textContent = bestText("ベスト差","秒","low");
        main.textContent="もう一回";
      }
    };
    document.getElementById("reset").onclick=reset;
  };

  engines.sort = function(){
    setHTML(`
      <h1 class="play-title">${game.title}</h1>
      <p class="play-desc">${game.desc}</p>
      <div class="status-row">
        <div class="status-box">残り<strong id="time">${game.duration}</strong></div>
        <div class="status-box">スコア<strong id="score">0</strong></div>
        <div class="status-box">コンボ<strong id="combo">0</strong></div>
      </div>
      <div class="stage">
        <div class="big" id="emoji">?</div>
        <div class="medium" id="name">準備中</div>
      </div>
      <div class="btn-row">
        <button id="start">スタート</button>
        <button class="secondary" id="reset">リセット</button>
      </div>
      <div class="choice-grid">
        <button class="choice" id="left">${game.left.label}</button>
        <button class="choice" id="right">${game.right.label}</button>
      </div>
      <div class="result" id="result">スタートを押してください。</div>
      <div class="small-note" id="best">${bestText("ベスト","点")}</div>
    `);
    let score=0, combo=0, time=game.duration, playing=false, timerId=null, current=null;
    const els = {
      time:document.getElementById("time"), score:document.getElementById("score"), combo:document.getElementById("combo"),
      emoji:document.getElementById("emoji"), name:document.getElementById("name"), result:document.getElementById("result"),
      start:document.getElementById("start"), best:document.getElementById("best")
    };
    function update(){ els.time.textContent=time; els.score.textContent=score; els.combo.textContent=combo; }
    function pick(){ current=sample(game.items); els.emoji.textContent=current[0]; els.name.textContent=current[1]; }
    function finish(){
      playing=false; clearInterval(timerId); els.start.disabled=false; els.start.textContent="もう一回";
      els.emoji.textContent="🏁"; els.name.textContent="終了";
      els.result.innerHTML=`最終スコア：${score}点`;
      updateBest(score); els.best.textContent=bestText("ベスト","点");
    }
    function start(){
      score=0; combo=0; time=game.duration; playing=true; update(); pick();
      els.start.disabled=true; els.result.textContent="どんどん仕分けてください。";
      timerId=setInterval(()=>{ time--; update(); if(time<=0) finish(); },1000);
    }
    function choose(key){
      if(!playing) return;
      if(current[2]===key){ combo++; score += 10 + Math.min(combo,10); els.result.textContent="正解です。"; }
      else{ combo=0; score=Math.max(0,score-5); els.result.textContent="違います。"; }
      update(); pick();
    }
    els.start.onclick=start;
    document.getElementById("reset").onclick=()=>{ clearInterval(timerId); playing=false; score=0; combo=0; time=game.duration; current=null; update(); els.emoji.textContent="?"; els.name.textContent="準備中"; els.start.disabled=false; els.start.textContent="スタート"; els.result.textContent="スタートを押してください。";};
    document.getElementById("left").onclick=()=>choose(game.left.key);
    document.getElementById("right").onclick=()=>choose(game.right.key);
  };

  engines.targetTap = function(){
    setHTML(`
      <h1 class="play-title">${game.title}</h1><p class="play-desc">${game.desc}</p>
      <div class="status-row"><div class="status-box">残り<strong id="time">${game.duration}</strong></div><div class="status-box">スコア<strong id="score">0</strong></div><div class="status-box">目標<strong>${game.targetLabel}</strong></div></div>
      <div class="stage"><div class="hint">「${game.target}」だけタップ</div><div class="grid" id="grid"></div></div>
      <div class="btn-row"><button id="start">スタート</button><button class="secondary" id="reset">リセット</button></div>
      <div class="result" id="result">スタートを押してください。</div><div class="small-note" id="best">${bestText("ベスト","点")}</div>
    `);
    let score=0,time=game.duration,playing=false,timerId=null;
    const grid=document.getElementById("grid"), result=document.getElementById("result"), scoreEl=document.getElementById("score"), timeEl=document.getElementById("time"), best=document.getElementById("best"), startBtn=document.getElementById("start");
    function fill(){
      grid.innerHTML="";
      const cells=[];
      const targetCount=2+rand(3);
      for(let i=0;i<targetCount;i++) cells.push(game.target);
      while(cells.length<12){
        let x=sample(game.items);
        if(x===game.target && Math.random()<.7) x=sample(game.items.filter(v=>v!==game.target));
        cells.push(x);
      }
      shuffle(cells).forEach(x=>{
        const div=document.createElement("div"); div.className="cell"; div.textContent=x;
        div.onclick=()=>{ if(!playing) return; if(x===game.target){ score+=10; result.textContent="回収しました。"; div.textContent=""; } else { score=Math.max(0,score-5); result.textContent="違います。"; } scoreEl.textContent=score; };
        grid.appendChild(div);
      });
    }
    function start(){
      score=0; time=game.duration; playing=true; scoreEl.textContent=score; timeEl.textContent=time; startBtn.disabled=true; result.textContent="目標だけをタップ。"; fill();
      timerId=setInterval(()=>{ time--; timeEl.textContent=time; if(time%5===0) fill(); if(time<=0){ playing=false; clearInterval(timerId); startBtn.disabled=false; startBtn.textContent="もう一回"; result.innerHTML=`終了。スコア：${score}点`; updateBest(score); best.textContent=bestText("ベスト","点"); }},1000);
    }
    startBtn.onclick=start;
    document.getElementById("reset").onclick=()=>{playing=false; clearInterval(timerId); score=0; time=game.duration; scoreEl.textContent=0; timeEl.textContent=time; startBtn.disabled=false; startBtn.textContent="スタート"; result.textContent="スタートを押してください。"; grid.innerHTML="";};
  };

  engines.orderTap = function(){
    setHTML(`
      <h1 class="play-title">${game.title}</h1><p class="play-desc">${game.desc}</p>
      <div class="status-row"><div class="status-box">残り<strong id="time">${game.duration}</strong></div><div class="status-box">スコア<strong id="score">0</strong></div><div class="status-box">次<strong id="next">1</strong></div></div>
      <div class="stage"><div class="grid" id="grid"></div></div>
      <div class="btn-row"><button id="start">スタート</button><button class="secondary" id="reset">リセット</button></div>
      <div class="result" id="result">スタートを押してください。</div><div class="small-note" id="best">${bestText("ベスト","点")}</div>
    `);
    let score=0,time=game.duration,next=1,playing=false,timerId=null;
    const grid=document.getElementById("grid"), scoreEl=document.getElementById("score"), timeEl=document.getElementById("time"), nextEl=document.getElementById("next"), result=document.getElementById("result"), best=document.getElementById("best"), startBtn=document.getElementById("start");
    function makeRound(){
      next=1; nextEl.textContent=next; grid.innerHTML="";
      shuffle([...Array(game.count)].map((_,i)=>i+1)).forEach(n=>{
        const div=document.createElement("div"); div.className="cell"; div.textContent=n;
        div.onclick=()=>{ if(!playing) return; if(n===next){ div.style.visibility="hidden"; score+=10; next++; if(next>game.count){ score+=30; result.textContent="クリア。次のセットへ。"; makeRound(); } else { result.textContent="OK"; nextEl.textContent=next; }} else { score=Math.max(0,score-5); result.textContent="順番が違います。"; } scoreEl.textContent=score; };
        grid.appendChild(div);
      });
    }
    function finish(){playing=false; clearInterval(timerId); startBtn.disabled=false; startBtn.textContent="もう一回"; result.innerHTML=`終了。スコア：${score}点`; updateBest(score); best.textContent=bestText("ベスト","点");}
    startBtn.onclick=()=>{score=0;time=game.duration;playing=true;scoreEl.textContent=0;timeEl.textContent=time;startBtn.disabled=true;makeRound();timerId=setInterval(()=>{time--;timeEl.textContent=time;if(time<=0)finish();},1000);};
    document.getElementById("reset").onclick=()=>{playing=false;clearInterval(timerId);score=0;time=game.duration;scoreEl.textContent=0;timeEl.textContent=time;startBtn.disabled=false;startBtn.textContent="スタート";grid.innerHTML="";result.textContent="スタートを押してください。";};
  };

  engines.reaction = function(){
    setHTML(`
      <h1 class="play-title">${game.title}</h1><p class="play-desc">${game.desc}</p>
      <div class="status-row"><div class="status-box">ラウンド<strong id="round">0/${game.rounds}</strong></div><div class="status-box">平均<strong id="avg">-</strong></div><div class="status-box">ベスト<strong id="mini">-</strong></div></div>
      <div class="stage" id="stage"><div class="medium" id="signal">待機中</div><div class="hint">GO! が出てから押してください。</div></div>
      <div class="btn-row"><button id="btn">スタート</button><button class="secondary" id="reset">リセット</button></div>
      <div class="result" id="result">スタートを押してください。</div><div class="small-note" id="best">${bestText("ベスト平均","ms","low")}</div>
    `);
    let round=0, waiting=false, ready=false, signalTime=0, timeout=null, results=[];
    const btn=document.getElementById("btn"), signal=document.getElementById("signal"), result=document.getElementById("result"), roundEl=document.getElementById("round"), avgEl=document.getElementById("avg"), miniEl=document.getElementById("mini"), best=document.getElementById("best");
    function next(){
      if(round>=game.rounds){ const avg=Math.round(results.reduce((a,b)=>a+b,0)/results.length); result.innerHTML=`終了。平均 ${avg}ms`; updateBest(avg,"low"); best.textContent=bestText("ベスト平均","ms","low"); btn.textContent="もう一回"; round=0; results=[]; return; }
      round++; roundEl.textContent=`${round}/${game.rounds}`; signal.textContent="まだ…"; result.textContent="GO! が出るまで待ってください。"; waiting=true; ready=false; btn.textContent="押す";
      timeout=setTimeout(()=>{ ready=true; waiting=false; signalTime=performance.now(); signal.textContent="GO!"; }, 900+rand(2300));
    }
    btn.onclick=()=>{
      if(btn.textContent==="スタート" || btn.textContent==="もう一回"){ round=0; results=[]; avgEl.textContent="-"; miniEl.textContent="-"; next(); return; }
      if(waiting){ clearTimeout(timeout); result.textContent="早すぎます。次へ。"; waiting=false; ready=false; setTimeout(next,700); return; }
      if(ready){ const ms=Math.round(performance.now()-signalTime); results.push(ms); avgEl.textContent=Math.round(results.reduce((a,b)=>a+b,0)/results.length)+"ms"; miniEl.textContent=Math.min(...results)+"ms"; result.textContent=`${ms}ms`; ready=false; setTimeout(next,700); }
    };
    document.getElementById("reset").onclick=()=>{clearTimeout(timeout);round=0;results=[];waiting=false;ready=false;btn.textContent="スタート";signal.textContent="待機中";roundEl.textContent=`0/${game.rounds}`;avgEl.textContent="-";miniEl.textContent="-";result.textContent="スタートを押してください。";};
  };

  engines.memorySequence = function(){
    setHTML(`
      <h1 class="play-title">${game.title}</h1><p class="play-desc">${game.desc}</p>
      <div class="status-row"><div class="status-box">ラウンド<strong id="round">0/${game.rounds}</strong></div><div class="status-box">スコア<strong id="score">0</strong></div><div class="status-box">長さ<strong id="len">-</strong></div></div>
      <div class="stage"><div class="medium" id="show">?</div><div class="hint" id="hint">順番を覚えてください。</div></div>
      <div class="choice-grid" id="buttons"></div>
      <div class="btn-row"><button id="start">スタート</button><button class="secondary" id="reset">リセット</button></div>
      <div class="result" id="result">スタートを押してください。</div><div class="small-note" id="best">${bestText("ベスト","点")}</div>
    `);
    let round=0, score=0, seq=[], input=[], accepting=false;
    const show=document.getElementById("show"), buttons=document.getElementById("buttons"), result=document.getElementById("result"), roundEl=document.getElementById("round"), scoreEl=document.getElementById("score"), lenEl=document.getElementById("len"), startBtn=document.getElementById("start"), best=document.getElementById("best"), hint=document.getElementById("hint");
    game.items.forEach(it=>{ const b=document.createElement("button"); b.className="choice"; b.textContent=it; b.onclick=()=>press(it); buttons.appendChild(b);});
    function setButtons(on){ buttons.querySelectorAll("button").forEach(b=>b.disabled=!on); }
    setButtons(false);
    async function playSeq(){
      accepting=false; setButtons(false); hint.textContent="順番を表示中。"; show.textContent="見て";
      for(const x of seq){
        await new Promise(r=>setTimeout(r,350)); show.textContent=x;
        await new Promise(r=>setTimeout(r,550)); show.textContent="・";
      }
      input=[]; accepting=true; setButtons(true); hint.textContent="同じ順番で押してください。"; show.textContent="入力";
    }
    function nextRound(){
      if(round>=game.rounds){ result.innerHTML=`終了。スコア：${score}点`; updateBest(score); best.textContent=bestText("ベスト","点"); startBtn.disabled=false; startBtn.textContent="もう一回"; setButtons(false); return; }
      round++; roundEl.textContent=`${round}/${game.rounds}`; seq.push(sample(game.items)); lenEl.textContent=seq.length; playSeq();
    }
    function press(x){
      if(!accepting) return;
      const idx=input.length;
      input.push(x);
      if(x !== seq[idx]){ result.textContent="違います。次の問題へ。"; accepting=false; setButtons(false); seq=[]; setTimeout(nextRound,700); return; }
      if(input.length===seq.length){ score += seq.length*20; scoreEl.textContent=score; result.textContent="正解です。"; accepting=false; setButtons(false); setTimeout(nextRound,700); }
    }
    startBtn.onclick=()=>{round=0;score=0;seq=[];scoreEl.textContent=0;startBtn.disabled=true;result.textContent="スタート。";nextRound();};
    document.getElementById("reset").onclick=()=>{round=0;score=0;seq=[];accepting=false;show.textContent="?";roundEl.textContent=`0/${game.rounds}`;scoreEl.textContent=0;lenEl.textContent="-";startBtn.disabled=false;startBtn.textContent="スタート";setButtons(false);result.textContent="スタートを押してください。";};
  };

  engines.gaugeStop = function(){
    setHTML(`
      <h1 class="play-title">${game.title}</h1><p class="play-desc">${game.desc}</p>
      <div class="status-row"><div class="status-box">回数<strong id="round">0/${game.rounds}</strong></div><div class="status-box">スコア<strong id="score">0</strong></div><div class="status-box">判定<strong id="judge">-</strong></div></div>
      <div class="stage"><div class="gauge"><div class="zone" id="zone"></div><div class="needle" id="needle"></div></div><div class="hint">緑の範囲で止めてください。</div></div>
      <div class="btn-row"><button id="main">スタート</button><button class="secondary" id="reset">リセット</button></div>
      <div class="result" id="result">スタートを押してください。</div><div class="small-note" id="best">${bestText("ベスト","点")}</div>
    `);
    let running=false,pos=0,dir=1,anim=null,round=0,score=0;
    const needle=document.getElementById("needle"), zone=document.getElementById("zone"), main=document.getElementById("main"), result=document.getElementById("result"), scoreEl=document.getElementById("score"), roundEl=document.getElementById("round"), judge=document.getElementById("judge"), best=document.getElementById("best");
    zone.style.left=game.targetMin+"%"; zone.style.width=(game.targetMax-game.targetMin)+"%";
    function tick(){ pos += dir*1.8; if(pos>=100){pos=100;dir=-1;} if(pos<=0){pos=0;dir=1;} needle.style.left=pos+"%"; anim=requestAnimationFrame(tick); }
    function start(){ running=true; main.textContent="ストップ"; tick(); }
    function stop(){
      running=false; cancelAnimationFrame(anim); round++;
      let add=0, msg="";
      if(pos>=game.targetMin && pos<=game.targetMax){ add=100; msg="ぴったり。"; }
      else { const dist=Math.min(Math.abs(pos-game.targetMin), Math.abs(pos-game.targetMax)); add=Math.max(0, Math.round(80-dist*3)); msg= add>50 ? "惜しい。" : "ズレました。"; }
      score += add; scoreEl.textContent=score; roundEl.textContent=`${round}/${game.rounds}`; judge.textContent=add+"点"; result.textContent=msg;
      if(round>=game.rounds){ main.textContent="もう一回"; updateBest(score); best.textContent=bestText("ベスト","点"); result.innerHTML=`終了。スコア：${score}点`; }
      else { main.textContent="次へ"; }
    }
    main.onclick=()=>{ if(round>=game.rounds){ round=0;score=0;pos=0;dir=1;scoreEl.textContent=0;roundEl.textContent=`0/${game.rounds}`;judge.textContent="-";result.textContent="スタートを押してください。"; } if(!running) start(); else stop(); };
    document.getElementById("reset").onclick=()=>{cancelAnimationFrame(anim);running=false;round=0;score=0;pos=0;dir=1;needle.style.left="0%";scoreEl.textContent=0;roundEl.textContent=`0/${game.rounds}`;judge.textContent="-";main.textContent="スタート";result.textContent="スタートを押してください。";};
  };

  engines.oddOne = function(){
    const pairs=[["🐶","🐱"],["🍎","🍅"],["⚽","🏀"],["🌙","⭐"],["🚗","🚕"],["🍙","🍘"]];
    setHTML(`
      <h1 class="play-title">${game.title}</h1><p class="play-desc">${game.desc}</p>
      <div class="status-row"><div class="status-box">残り<strong id="time">${game.duration}</strong></div><div class="status-box">スコア<strong id="score">0</strong></div><div class="status-box">正解<strong id="ok">0</strong></div></div>
      <div class="stage"><div class="grid" id="grid"></div></div>
      <div class="btn-row"><button id="start">スタート</button><button class="secondary" id="reset">リセット</button></div>
      <div class="result" id="result">スタートを押してください。</div><div class="small-note" id="best">${bestText("ベスト","点")}</div>
    `);
    let score=0,ok=0,time=game.duration,playing=false,timerId=null,answerIndex=0;
    const grid=document.getElementById("grid"), scoreEl=document.getElementById("score"), timeEl=document.getElementById("time"), okEl=document.getElementById("ok"), result=document.getElementById("result"), startBtn=document.getElementById("start"), best=document.getElementById("best");
    function round(){
      const [same,odd]=sample(pairs); answerIndex=rand(12); grid.innerHTML="";
      for(let i=0;i<12;i++){ const div=document.createElement("div"); div.className="cell"; div.textContent=i===answerIndex?odd:same; div.onclick=()=>{ if(!playing)return; if(i===answerIndex){score+=20;ok++;result.textContent="正解。";round();} else {score=Math.max(0,score-5);result.textContent="違います。";} scoreEl.textContent=score;okEl.textContent=ok;}; grid.appendChild(div);}
    }
    function finish(){playing=false;clearInterval(timerId);startBtn.disabled=false;startBtn.textContent="もう一回";result.innerHTML=`終了。スコア：${score}点`;updateBest(score);best.textContent=bestText("ベスト","点");}
    startBtn.onclick=()=>{score=0;ok=0;time=game.duration;playing=true;scoreEl.textContent=0;okEl.textContent=0;timeEl.textContent=time;startBtn.disabled=true;round();timerId=setInterval(()=>{time--;timeEl.textContent=time;if(time<=0)finish();},1000);};
    document.getElementById("reset").onclick=()=>{playing=false;clearInterval(timerId);score=0;ok=0;time=game.duration;grid.innerHTML="";scoreEl.textContent=0;okEl.textContent=0;timeEl.textContent=time;startBtn.disabled=false;startBtn.textContent="スタート";result.textContent="スタートを押してください。";};
  };

  engines.mathChoice = function(){
    return choiceLoop({
      make(){
        const a=1+rand(20), b=1+rand(20), op=Math.random()<.55?"+":"-";
        const ans=op==="+"?a+b:a-b;
        const choices=shuffle([ans, ans+1+rand(3), ans-1-rand(3), ans+5-rand(11)]).slice(0,4);
        if(!choices.includes(ans)) choices[0]=ans;
        return {q:`${a} ${op} ${b} = ?`, answer:String(ans), choices:shuffle([...new Set(choices)]).map(String)};
      }
    });
  };

  engines.compare = function(){
    return choiceLoop({
      make(){
        let a=rand(100), b=rand(100); if(a===b) b=(b+1)%100;
        const ans = a>b ? "左" : "右";
        return {q:`大きい数字はどっち？\n${a}　vs　${b}`, answer:ans, choices:["左","右"]};
      }
    });
  };

  engines.wordColor = function(){
    const colors=[["赤","red","#ef4444"],["青","blue","#2563eb"],["黄","yellow","#eab308"],["緑","green","#16a34a"]];
    return choiceLoop({
      make(){
        const word=sample(colors), actual=sample(colors);
        return {q:`<span style="color:${actual[2]}">${word[0]}</span>`, answer:actual[0], choices:colors.map(c=>c[0]), html:true, hint:"文字の意味ではなく、文字の色を選んでください。"};
      }
    });
  };

  engines.emojiCount = function(){
    const emojis=["🍙","🍎","⭐","🔵"];
    return choiceLoop({
      make(){
        const target=sample(emojis), count=2+rand(5);
        const cells=[];
        for(let i=0;i<count;i++) cells.push(target);
        while(cells.length<12) cells.push(sample(emojis.filter(e=>e!==target)));
        const choices=shuffle([count, Math.max(0,count-1), count+1, count+2]).slice(0,4).map(String);
        return {q:`${shuffle(cells).join(" ")}\n\n${target} は何個？`, answer:String(count), choices, multiline:true};
      }
    });
  };

  engines.clickRush = function(){
    setHTML(`
      <h1 class="play-title">${game.title}</h1><p class="play-desc">${game.desc}</p>
      <div class="status-row"><div class="status-box">残り<strong id="time">${game.duration}</strong></div><div class="status-box">回数<strong id="score">0</strong></div><div class="status-box">状態<strong id="state">待機</strong></div></div>
      <div class="stage"><button id="tap" style="min-width:220px;min-height:120px;font-size:28px">TAP</button></div>
      <div class="btn-row"><button id="start">スタート</button><button class="secondary" id="reset">リセット</button></div>
      <div class="result" id="result">スタートを押してください。</div><div class="small-note" id="best">${bestText("ベスト","回")}</div>
    `);
    let score=0,time=game.duration,playing=false,timerId=null;
    const scoreEl=document.getElementById("score"),timeEl=document.getElementById("time"),state=document.getElementById("state"),result=document.getElementById("result"),best=document.getElementById("best"),startBtn=document.getElementById("start");
    document.getElementById("tap").onclick=()=>{if(!playing)return;score++;scoreEl.textContent=score;};
    startBtn.onclick=()=>{score=0;time=game.duration;playing=true;scoreEl.textContent=0;timeEl.textContent=time;state.textContent="連打";startBtn.disabled=true;result.textContent="押してください。";timerId=setInterval(()=>{time--;timeEl.textContent=time;if(time<=0){playing=false;clearInterval(timerId);startBtn.disabled=false;startBtn.textContent="もう一回";state.textContent="終了";result.innerHTML=`${score}回押しました。`;updateBest(score);best.textContent=bestText("ベスト","回");}},1000);};
    document.getElementById("reset").onclick=()=>{playing=false;clearInterval(timerId);score=0;time=game.duration;scoreEl.textContent=0;timeEl.textContent=time;state.textContent="待機";startBtn.disabled=false;startBtn.textContent="スタート";result.textContent="スタートを押してください。";};
  };

  function choiceLoop(opts){
    setHTML(`
      <h1 class="play-title">${game.title}</h1><p class="play-desc">${game.desc}</p>
      <div class="status-row"><div class="status-box">残り<strong id="time">${game.duration}</strong></div><div class="status-box">スコア<strong id="score">0</strong></div><div class="status-box">正解<strong id="ok">0</strong></div></div>
      <div class="stage"><div class="medium" id="q">準備中</div><div class="hint" id="hint"></div></div>
      <div class="choice-grid" id="choices"></div>
      <div class="btn-row"><button id="start">スタート</button><button class="secondary" id="reset">リセット</button></div>
      <div class="result" id="result">スタートを押してください。</div><div class="small-note" id="best">${bestText("ベスト","点")}</div>
    `);
    let score=0,ok=0,time=game.duration,playing=false,timerId=null,current=null;
    const q=document.getElementById("q"), choicesEl=document.getElementById("choices"), hint=document.getElementById("hint"), scoreEl=document.getElementById("score"),okEl=document.getElementById("ok"),timeEl=document.getElementById("time"),result=document.getElementById("result"),best=document.getElementById("best"),startBtn=document.getElementById("start");
    function next(){
      current=opts.make(); q.innerHTML = (current.multiline ? current.q.replace(/\n/g,"<br>") : current.q); hint.textContent=current.hint || "";
      choicesEl.innerHTML="";
      current.choices.forEach(c=>{ const b=document.createElement("button"); b.className="choice"; b.textContent=c; b.onclick=()=>choose(c); choicesEl.appendChild(b);});
    }
    function choose(c){
      if(!playing)return;
      if(c===current.answer){score+=20;ok++;result.textContent="正解です。";} else {score=Math.max(0,score-5);result.textContent="違います。";}
      scoreEl.textContent=score;okEl.textContent=ok;next();
    }
    function finish(){playing=false;clearInterval(timerId);startBtn.disabled=false;startBtn.textContent="もう一回";result.innerHTML=`終了。スコア：${score}点`;updateBest(score);best.textContent=bestText("ベスト","点");}
    startBtn.onclick=()=>{score=0;ok=0;time=game.duration;playing=true;scoreEl.textContent=0;okEl.textContent=0;timeEl.textContent=time;startBtn.disabled=true;next();timerId=setInterval(()=>{time--;timeEl.textContent=time;if(time<=0)finish();},1000);};
    document.getElementById("reset").onclick=()=>{playing=false;clearInterval(timerId);score=0;ok=0;time=game.duration;scoreEl.textContent=0;okEl.textContent=0;timeEl.textContent=time;choicesEl.innerHTML="";q.textContent="準備中";hint.textContent="";startBtn.disabled=false;startBtn.textContent="スタート";result.textContent="スタートを押してください。";};
  }

  const engine = engines[game.type];
  if(engine) engine();
  else root.innerHTML = base(`<p>未対応のゲームタイプです。</p>`);
})();
