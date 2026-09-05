'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Expand, Moon, Sun, Sunset, Volume2, VolumeX, X, Mountain, MoveUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scenes, type SceneKey } from '@/lib/scene';

export default function Home() {
  const [scene, setScene] = useState<SceneKey>('golden');
  const [immersive, setImmersive] = useState(false);
  const [close, setClose] = useState(false);
  const [sound, setSound] = useState(false);
  const [notice, setNotice] = useState('');
  const audio = useRef<AudioContext | null>(null);
  const enterButton = useRef<HTMLButtonElement | null>(null);
  const exitButton = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (immersive) exitButton.current?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setImmersive(false); enterButton.current?.focus(); }
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [immersive]);
  useEffect(() => () => { void audio.current?.close(); }, []);

  async function toggleSound() {
    try {
      if (sound) { await audio.current?.suspend(); setSound(false); return; }
      if (!audio.current) {
        const context = new AudioContext();
        audio.current = context;
        const buffer = context.createBuffer(1, context.sampleRate * 8, context.sampleRate);
        const data = buffer.getChannelData(0);
        let previous = 0;
        for (let i = 0; i < data.length; i++) {
          previous = (previous + (Math.random() * 2 - 1) * 0.02) / 1.02;
          data[i] = previous * 3.5;
        }
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const filter = context.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = 650;
        const gain = context.createGain(); gain.gain.value = 0.2;
        const swell = context.createOscillator(); swell.frequency.value = 0.12;
        const depth = context.createGain(); depth.gain.value = 0.09;
        swell.connect(depth).connect(gain.gain);
        source.connect(filter).connect(gain).connect(context.destination);
        source.start(); swell.start();
      }
      await audio.current.resume();
      setSound(true); setNotice('');
    } catch { setNotice('声音未启动，请再次点击重试。'); }
  }

  return (
    <main>
      <section id="home" className={`experience ${immersive ? 'immersive' : ''}`} data-scene={scene} aria-label="悬崖小屋建筑渲染">
        <div className={`scene-image ${close ? 'close-view' : ''}`} style={{ filter: scenes[scene].filter }}>
          <img src="/cliff-house.png" alt="一间亮着暖光的木屋伫立在草坡与悬崖边，面向辽阔的大海和落日" fetchPriority="high" />
        </div>
        <div className="scene-shade" />
        <div className="blue-tint" aria-hidden="true" />
        <div className="interface" inert={immersive}>
          <header className="site-header">
            <a className="brand" href="#home" aria-label="崖居首页"><Mountain size={30} strokeWidth={1.1} /><span>崖居<small>CLIFF HOUSE</small></span></a>
            <nav aria-label="主导航"><a className="active" href="#home">一间小屋</a><a href="#concept">关于设计 <ArrowUpRight size={13} /></a></nav>
            <span className="edition">独处计划 <span>—</span> NO. 001</span>
          </header>
          <div className="hero-copy">
            <div className="eyebrow"><span /> BETWEEN LAND & SEA</div>
            <h1>在世界边缘，<br />安放日常<span>。</span></h1>
            <p>把喧嚣留在身后。<br />在一间小房子里，听见一整片海。</p>
            <Button ref={enterButton} className="enter-button" onClick={() => setImmersive(true)}>进入静谧 <ArrowUpRight size={18} /></Button>
            <span className="experience-note">一场关于栖居的建筑白日梦</span>
          </div>
          <div className="side-note"><span>01 / 01</span><i /><span>THE ART OF SLOW LIVING</span></div>
          <div className="bottom-bar">
            <a className="discover" href="#concept"><span className="round-icon"><ArrowDown size={17} /></span><span>向自然，靠近一点<small>SCROLL TO DISCOVER</small></span></a>
            <div className="light-control" role="group" aria-label="选择光影氛围">
              <span className="control-label">光影时刻</span>
              {([{key:'day',icon:Sun},{key:'golden',icon:Sunset},{key:'blue',icon:Moon}] as const).map(({key,icon:Icon}) => <Button key={key} variant="ghost" className={`light-button ${scene === key ? 'selected' : ''}`} aria-pressed={scene === key} onClick={() => setScene(key)}><Icon size={15} />{scenes[key].label}</Button>)}
            </div>
            <div className="view-controls"><Button variant="ghost" className="icon-button" aria-label={close ? '切换全景构图' : '放大小屋构图'} aria-pressed={close} onClick={() => setClose(!close)}><Expand size={18} /></Button><Button variant="ghost" className="sound-button" aria-label={sound ? '关闭海浪氛围音' : '播放合成海浪氛围音'} aria-pressed={sound} onClick={toggleSound}>{sound ? <Volume2 size={17} /> : <VolumeX size={17} />}<span>海的声音</span></Button></div>
          </div>
        </div>
        {immersive && <div className="immersive-controls"><span>此刻，只剩下你与海。</span><Button ref={exitButton} className="exit-button" onClick={() => {setImmersive(false); requestAnimationFrame(() => enterButton.current?.focus());}}><X size={16} />退出沉浸 <kbd>ESC</kbd></Button></div>}
        <output className="sr-only" aria-live="polite">{scenes[scene].label}氛围，{close ? '近景' : '全景'}构图。{notice}</output>
        {notice && <p className="notice" role="status">{notice}</p>}
      </section>
      <section id="concept" className="concept">
        <div className="concept-heading"><span className="section-index">001 / 栖居的想象</span><h2>房子很小。<br />生活，可以很辽阔。</h2><p>一面山崖，一片海，一扇始终朝向光的窗。<br />让建筑退后，让自然成为空间的主角。</p><a href="#home">回到海边 <MoveUpRight size={18} /></a></div>
        <div className="concept-details"><span className="eyebrow">A QUIET PLACE TO BE</span><p>木的温度，石的质感，<br />以及不需要被填满的留白。</p><dl><div><dt>建筑语言</dt><dd>原木 · 玻璃 · 深色金属</dd></div><div><dt>场景设定</dt><dd>海岸悬崖 / 独处小屋</dd></div><div><dt>光影体验</dt><dd>日光 · 金色时刻 · 蓝调</dd></div></dl><small>概念建筑渲染 · AI 生成图像 · 光影切换为艺术滤镜</small></div>
      </section>
      <footer><a className="footer-brand" href="#home">崖居 <span>CLIFF HOUSE</span></a><p>少一点世界，多一点自己。</p><span>AN ARCHITECTURAL DAYDREAM</span></footer>
    </main>
  );
}
