import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Mail, Lock, Eye, EyeOff, PenTool, ArrowRight, Github, X } from 'lucide-react';

/* --- 图标组件 --- */
interface IconProps {
  className?: string;
}

const UserIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SparklesIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M9 5h4" />
    <path d="M18 19l2-4" />
    <path d="M16 21l2-4" />
  </svg>
);

/* --- 樱花背景组件 --- */
interface Petal {
  id: number;
  left: string;
  animationDuration: string;
  animationDelay: string;
  scale: number;
}

const SakuraPetal = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute pointer-events-none animate-fall opacity-70" style={style}>
    <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C15 0 19.5 9 27 15C27 24 19.5 30 15 25.5C10.5 30 3 24 3 15C10.5 9 15 0 15 0Z" fill="#FECDD3" />
    </svg>
  </div>
);

const SakuraBackground = () => {
  const [petals, setPetals] = useState<Petal[]>([]);
  useEffect(() => {
    const initialPetals = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 10}s`,
      animationDelay: `${Math.random() * 5}s`,
      scale: Math.random() * 0.5 + 0.5,
    }));
    setPetals(initialPetals);
  }, []);
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {petals.map((petal) => (
        <SakuraPetal key={petal.id} style={{ left: petal.left, animationDuration: petal.animationDuration, animationDelay: petal.animationDelay, transform: `scale(${petal.scale})` }} />
      ))}
    </div>
  );
};

/* --- 互动彩蛋：六边形原木御神籤 (Omikuji) 组件 --- */
interface Fortune {
  type: string;
  color: string;
  text: string;
  desc: string;
}

const OmikujiBox = () => {
  const [state, setState] = useState<'idle' | 'shaking' | 'popping' | 'result'>('idle'); // idle, shaking, popping, result
  const [result, setResult] = useState<Fortune | null>(null);

  // 运势数据
  const fortunes: Fortune[] = [
    { type: "大吉", color: "#ef4444", text: "灵感如泉涌，下笔如有神。", desc: "今日是开启长篇巨著的最佳时机。" },
    { type: "中吉", color: "#f97316", text: "柳暗花明处，佳句自天成。", desc: "尝试新的题材，会有意外收获。" },
    { type: "小吉", color: "#eab308", text: "积跬步千里，字句皆珠玑。", desc: "专注于细节描写，今日宜精修。" },
    { type: "吉", color: "#22c55e", text: "平淡见真章，日常即奇迹。", desc: "从生活中取材，记录当下的感悟。" },
    { type: "凶", color: "#1e293b", text: "迷雾遮望眼，静心待天晴。", desc: "若遇卡顿，不妨停笔阅读，明日再战。" },
  ];

  const handleClick = useCallback(() => {
    if (state !== 'idle') return;

    // 1. 开始摇晃
    setState('shaking');

    // 2. 摇晃结束后，签棒弹出
    setTimeout(() => {
      setState('popping');
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      setResult(randomFortune);

      // 3. 签棒展示后，显示结果详情 (屏幕中央)
      setTimeout(() => {
        setState('result');
      }, 800);
    }, 1500); // 摇晃持续 1.5秒
  }, [state]);

  const reset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setState('idle');
    setResult(null);
  };

  return (
    <>
      {/* 签筒主体 - 原木六边形风格 */}
      <div
        className={`relative w-40 h-72 flex flex-col items-center justify-end z-20 group cursor-pointer transition-transform duration-300 ${state === 'idle' ? 'hover:-rotate-1 hover:scale-105' : ''}`}
        onClick={handleClick}
      >

        {/* 提示文字 */}
        <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-stone-500 font-serif tracking-widest transition-opacity duration-500 whitespace-nowrap bg-white/50 px-2 py-1 rounded backdrop-blur-sm ${state === 'idle' ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
          クリックして占う
        </div>

        {/* 摇晃动画容器 */}
        <div className={`relative w-full h-full flex items-end justify-center ${state === 'shaking' ? 'animate-violent-shake' : state === 'idle' ? 'group-hover:animate-gentle-wiggle' : ''}`}>

          {/* 弹出的签棒 */}
          <div className={`absolute bottom-[92%] w-1.5 h-24 bg-amber-100 border border-amber-200 rounded-sm transition-all duration-500 ease-out z-0 ${state === 'popping' ? '-translate-y-8 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[6px] font-serif writing-vertical text-red-600 opacity-80">第六番</div>
          </div>

          {/* 六边形原木签筒 SVG */}
          <svg width="160" height="240" viewBox="0 0 160 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl relative z-10">
            <defs>
              <linearGradient id="wood_main" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#dcc098" />
                <stop offset="0.2" stopColor="#e8d3b3" />
                <stop offset="0.4" stopColor="#dcc098" />
                <stop offset="0.5" stopColor="#cbb08a" />
                <stop offset="0.6" stopColor="#dcc098" />
                <stop offset="0.8" stopColor="#e8d3b3" />
                <stop offset="1" stopColor="#dcc098" />
              </linearGradient>
              <linearGradient id="wood_top" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#cbb08a" />
                <stop offset="1" stopColor="#bfa37e" />
              </linearGradient>
            </defs>

            <path d="M30 40 L130 40 L130 220 L30 220 Z" fill="url(#wood_main)" stroke="#bfa37e" strokeWidth="1" />
            <path d="M30 40 L50 25 L110 25 L130 40 L110 55 L50 55 Z" fill="url(#wood_top)" stroke="#a88d6b" strokeWidth="1" />
            <ellipse cx="80" cy="40" rx="4" ry="2" fill="#2d2a26" />
            <path d="M55 40 L55 220" stroke="#bfa37e" strokeWidth="1" strokeOpacity="0.5" />
            <path d="M105 40 L105 220" stroke="#bfa37e" strokeWidth="1" strokeOpacity="0.5" />
            <path d="M30 45 L130 45" stroke="#bfa37e" strokeWidth="2" />
            <path d="M30 215 L130 215" stroke="#bfa37e" strokeWidth="2" />

            <g transform="translate(80, 130) scale(0.7)" textAnchor="middle">
              <path d="M-5 -60 Q10 -65 15 -60 Q20 -50 5 -45 Q-10 -40 -10 -30 Q-10 -15 10 -20 M12 -65 Q15 -55 20 -50" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M-8 -10 Q5 -15 10 -5 Q15 5 -5 10 Q-15 15 -10 25 M15 -10 Q12 0 10 15" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M0 35 L10 45 L0 55" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M-5 70 Q0 80 5 70 Q10 60 5 90 Q0 100 -10 95 M12 65 L15 68 M18 62 L21 65" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      </div>

      {/* 结果展示层 - 使用 Portal 渲染到 body 根节点，确保不受父级 transform 影响而居中显示 */}
      {state === 'result' && result && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm animate-fade-in" onClick={reset}>
          <div
            className="relative w-[280px] min-h-[520px] bg-[#fffbf0] shadow-2xl flex flex-col items-center animate-paper-unfold cursor-auto rounded-sm"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.1\'/%3E%3C/svg%3E")',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full pt-8 flex flex-col items-center opacity-80">
              <div className="w-8 h-8 border border-stone-800 rotate-45 mb-2"></div>
              <div className="text-[10px] tracking-[0.3em] font-serif text-stone-500">AI NOVEL OMIGUKI</div>
            </div>
            <div className="flex-1 w-full py-8 flex flex-col items-center justify-center gap-6 relative">
              <div className="writing-vertical text-7xl font-serif font-black tracking-wider drop-shadow-sm z-10" style={{ color: result.color }}>
                {result.type}
              </div>
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-stone-300 to-transparent"></div>
              <div className="writing-vertical text-xl font-serif text-stone-700 tracking-widest leading-loose h-40 z-10">
                {result.text}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <span className="text-9xl font-serif">運</span>
              </div>
            </div>
            <div className="w-full p-8 text-center bg-stone-100/50 border-t border-stone-200/60">
              <p className="text-xs text-stone-500 font-serif leading-relaxed">
                <span className="block text-stone-400 text-[10px] mb-2 uppercase tracking-widest">Interpretation</span>
                {result.desc}
              </p>
            </div>
            <button onClick={reset} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 transition-colors p-2">
              <X size={20} />
            </button>
          </div>
          <div className="absolute bottom-12 text-white/90 text-sm font-light tracking-[0.2em] animate-pulse pointer-events-none">
            点击空白处关闭
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isHoveringBtn, setIsHoveringBtn] = useState(false);

  const handleTabSwitch = (tab: 'login' | 'register') => {
    setActiveTab(tab);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted', activeTab);
  };

  // 动态高度控制：根据 Tab 状态设置高度
  const containerHeight = activeTab === 'login' ? 'md:h-[600px]' : 'md:h-[680px]';

  return (
    <div className="min-h-screen bg-[#Fdfbf7] text-stone-800 font-sans relative overflow-x-hidden flex flex-col md:flex-row">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg) translateX(0px); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(360deg) translateX(50px); opacity: 0; }
        }
        @keyframes violent-shake {
          0%, 100% { transform: translateX(0) rotate(0); }
          10% { transform: translateX(-2px) rotate(-5deg); }
          20% { transform: translateX(2px) rotate(5deg); }
          30% { transform: translateX(-4px) rotate(-7deg); }
          40% { transform: translateX(4px) rotate(7deg); }
          50% { transform: translateX(-2px) rotate(-5deg); }
          60% { transform: translateX(2px) rotate(5deg); }
          80% { transform: translateX(0) rotate(0); }
        }
        @keyframes paper-unfold {
          0% { transform: scale(0.1) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.05) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fall { animation: fall linear infinite; }
        .animate-violent-shake { animation: violent-shake 0.8s ease-in-out; }
        .animate-paper-unfold { animation: paper-unfold 1.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .writing-vertical { writing-mode: vertical-rl; text-orientation: mixed; }
        .bg-washi {
          background-color: #ffffff;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
        }
        
        /* 隐藏滚动条 */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <SakuraBackground />

      {/* --- 左侧互动区域 --- */}
      <div className="relative flex-1 hidden lg:flex items-center justify-center p-12 transition-all duration-1000">
        <div className="absolute left-12 top-20 writing-vertical text-9xl font-serif text-stone-900/5 select-none pointer-events-none transition-all duration-700 delay-100">
          {activeTab === 'login' ? '物語' : '旅路'}
        </div>

        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/3">
          <OmikujiBox />
        </div>

        <div className="absolute bottom-12 left-12 max-w-xs text-stone-400 text-sm leading-relaxed font-serif italic">
          "心中默念所求之事，<br />摇动签筒，探寻创作的指引。"
        </div>
      </div>

      {/* --- 右侧内容区域 --- */}
      <div className="w-full lg:w-auto min-w-[50vw] min-h-screen flex items-center justify-center lg:justify-start lg:pl-12 lg:pr-24 relative z-10 backdrop-blur-sm lg:backdrop-blur-none">

        {/* 卡片容器：高度动态变化 */}
        <div className={`relative w-full max-w-4xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-md border border-white/50 m-4 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${containerHeight}`}>

          {/* 左侧：氛围插画区 */}
          <div className="hidden md:flex w-2/5 bg-stone-100 relative items-center justify-center overflow-hidden group">
            <div className={`absolute w-48 h-48 rounded-full blur-3xl opacity-40 transition-all duration-1000 ease-in-out ${activeTab === 'login' ? 'bg-rose-200 scale-100 translate-y-0' : 'bg-blue-100 scale-125 translate-y-12'}`}></div>

            {/* 装饰图标：平滑切换 */}
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 mb-6">
                <div className={`absolute inset-0 rounded-full flex items-center justify-center shadow-lg transition-all duration-700 transform ${activeTab === 'login' ? 'bg-stone-800 rotate-0 opacity-100 scale-100' : 'bg-stone-800 -rotate-90 opacity-0 scale-50'}`}>
                  <PenTool className="w-8 h-8 text-rose-100" />
                </div>
                <div className={`absolute inset-0 rounded-full flex items-center justify-center shadow-lg transition-all duration-700 transform ${activeTab === 'register' ? 'bg-rose-800 rotate-0 opacity-100 scale-100' : 'bg-rose-800 rotate-90 opacity-0 scale-50'}`}>
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* 文本区域：使用绝对定位叠加实现淡入淡出 */}
              <div className="relative h-24 w-full flex justify-center">
                <div className={`absolute top-0 w-full flex flex-col items-center px-6 transition-all duration-500 transform ${activeTab === 'login' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4 tracking-wide">灵感涌现</h2>
                  <p className="text-stone-500 text-sm leading-relaxed text-center">让 AI 协助您编织每一个精彩的章节。</p>
                </div>
                <div className={`absolute top-0 w-full flex flex-col items-center px-6 transition-all duration-500 transform ${activeTab === 'register' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4 tracking-wide">初次见面</h2>
                  <p className="text-stone-500 text-sm leading-relaxed text-center">注册账户，开启无限可能的创作之旅。</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full opacity-10">
              <svg viewBox="0 0 1440 320" className="w-full text-stone-800 fill-current">
                <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,150,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </div>

          {/* 右侧：表单区 - 滑动门实现 */}
          <div className="w-full md:w-3/5 relative bg-washi overflow-hidden flex flex-col">

            {/* 顶部 Tab 栏 (固定在顶部) */}
            <div className="flex gap-6 p-8 md:p-12 pb-0 mb-4 text-sm font-medium tracking-wider z-10 bg-transparent">
              <button onClick={() => handleTabSwitch('login')} className={`pb-2 transition-colors duration-300 ${activeTab === 'login' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-stone-400 hover:text-stone-600'}`}>登入 (Login)</button>
              <button onClick={() => handleTabSwitch('register')} className={`pb-2 transition-colors duration-300 ${activeTab === 'register' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-stone-400 hover:text-stone-600'}`}>注册 (Sign Up)</button>
            </div>

            {/* 滑动容器 (宽度 200%) */}
            <div className="flex-1 w-full relative">
              <div
                className="absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
                style={{ transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(-50%)' }}
              >
                {/* --- 登录表单页 --- */}
                <div className="w-1/2 h-full px-8 md:px-12 pb-8 flex flex-col">
                  <div className={`transition-all duration-500 delay-100 h-full flex flex-col ${activeTab === 'login' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">欢迎回来</h1>
                    <p className="text-stone-500 text-sm mb-8">续写您的传奇故事</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="group relative">
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1 ml-1 group-focus-within:text-rose-600 transition-colors">Email Address</label>
                        <div className="relative flex items-center">
                          <Mail className="w-5 h-5 text-stone-400 absolute left-0 group-focus-within:text-stone-800 transition-colors" />
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-stone-300 focus:border-rose-600 outline-none text-stone-800 placeholder-stone-300 transition-colors" placeholder="writer@story.com" />
                        </div>
                      </div>
                      <div className="group relative">
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1 ml-1 group-focus-within:text-rose-600 transition-colors">Password</label>
                        <div className="relative flex items-center">
                          <Lock className="w-5 h-5 text-stone-400 absolute left-0 group-focus-within:text-stone-800 transition-colors" />
                          <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-8 pr-10 py-2 bg-transparent border-b border-stone-300 focus:border-rose-600 outline-none text-stone-800 placeholder-stone-300 transition-colors" placeholder="••••••••" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 p-1 text-stone-400 hover:text-stone-600 focus:outline-none">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="w-4 h-4 border border-stone-300 rounded group-hover:border-rose-500 flex items-center justify-center transition-colors">
                            <div className="w-2 h-2 bg-rose-500 rounded-sm opacity-0 group-hover:opacity-20"></div>
                          </div>
                          <span className="text-stone-500 group-hover:text-stone-700">记住我</span>
                        </label>
                        <a href="#" className="text-stone-500 hover:text-rose-600 transition-colors decoration-rose-200 hover:underline">忘记密码?</a>
                      </div>
                      <button type="submit" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)} className="w-full bg-stone-900 text-rose-50 py-3 rounded-xl flex items-center justify-center gap-2 group transition-all duration-300 hover:bg-stone-800 hover:shadow-lg hover:shadow-rose-200/50 relative overflow-hidden mt-2">
                        <div className={`absolute inset-0 bg-rose-600 transition-transform duration-500 ease-out origin-left ${isHoveringBtn ? 'scale-x-100 opacity-10' : 'scale-x-0 opacity-0'}`}></div>
                        <span className="font-medium tracking-widest relative z-10">开始创作</span>
                        <ArrowRight className={`w-4 h-4 transition-transform duration-300 relative z-10 ${isHoveringBtn ? 'translate-x-1' : ''}`} />
                      </button>
                    </form>
                    <div className="mt-auto flex flex-col items-center gap-4">
                      <div className="flex items-center gap-3 w-full">
                        <div className="h-px bg-stone-200 flex-1"></div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider">Or continue with</span>
                        <div className="h-px bg-stone-200 flex-1"></div>
                      </div>
                      <div className="flex gap-4">
                        <button className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300">
                          <Github size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300">
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- 注册表单页 --- */}
                <div className="w-1/2 h-full px-8 md:px-12 pb-8 flex flex-col">
                  <div className={`transition-all duration-500 delay-100 ${activeTab === 'register' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">创建账户</h1>
                    <p className="text-stone-500 text-sm mb-6">免费加入我们的创作社区</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className={`group relative transition-all duration-500 delay-[100ms] ${activeTab === 'register' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1 ml-1 group-focus-within:text-rose-600 transition-colors">Pen Name</label>
                        <div className="relative flex items-center">
                          <UserIcon className="w-5 h-5 text-stone-400 absolute left-0 group-focus-within:text-stone-800 transition-colors" />
                          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-stone-300 focus:border-rose-600 outline-none text-stone-800 placeholder-stone-300 transition-colors" placeholder="Your pen name" />
                        </div>
                      </div>
                      <div className={`group relative transition-all duration-500 delay-[200ms] ${activeTab === 'register' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1 ml-1 group-focus-within:text-rose-600 transition-colors">Email Address</label>
                        <div className="relative flex items-center">
                          <Mail className="w-5 h-5 text-stone-400 absolute left-0 group-focus-within:text-stone-800 transition-colors" />
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-stone-300 focus:border-rose-600 outline-none text-stone-800 placeholder-stone-300 transition-colors" placeholder="writer@story.com" />
                        </div>
                      </div>
                      <div className={`group relative transition-all duration-500 delay-[300ms] ${activeTab === 'register' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1 ml-1 group-focus-within:text-rose-600 transition-colors">Password</label>
                        <div className="relative flex items-center">
                          <Lock className="w-5 h-5 text-stone-400 absolute left-0 group-focus-within:text-stone-800 transition-colors" />
                          <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-8 pr-10 py-2 bg-transparent border-b border-stone-300 focus:border-rose-600 outline-none text-stone-800 placeholder-stone-300 transition-colors" placeholder="••••••••" />
                        </div>
                      </div>
                      <div className={`group relative transition-all duration-500 delay-[400ms] ${activeTab === 'register' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1 ml-1 group-focus-within:text-rose-600 transition-colors">Confirm Password</label>
                        <div className="relative flex items-center">
                          <Lock className="w-5 h-5 text-stone-400 absolute left-0 group-focus-within:text-stone-800 transition-colors" />
                          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-8 pr-10 py-2 bg-transparent border-b border-stone-300 focus:border-rose-600 outline-none text-stone-800 placeholder-stone-300 transition-colors" placeholder="••••••••" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm pt-2">
                        <div className="text-stone-400 text-xs w-full text-center">
                          注册即代表您同意我们的 <a href="#" className="text-rose-600 hover:underline">服务条款</a> 和 <a href="#" className="text-rose-600 hover:underline">隐私政策</a>
                        </div>
                      </div>

                      <button type="submit" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)} className="w-full bg-stone-900 text-rose-50 py-3 rounded-xl flex items-center justify-center gap-2 group transition-all duration-300 hover:bg-stone-800 hover:shadow-lg hover:shadow-rose-200/50 relative overflow-hidden mt-2">
                        <div className={`absolute inset-0 bg-rose-600 transition-transform duration-500 ease-out origin-left ${isHoveringBtn ? 'scale-x-100 opacity-10' : 'scale-x-0 opacity-0'}`}></div>
                        <span className="font-medium tracking-widest relative z-10">立即注册</span>
                        <ArrowRight className={`w-4 h-4 transition-transform duration-300 relative z-10 ${isHoveringBtn ? 'translate-x-1' : ''}`} />
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
