
import React, { useState, useEffect } from 'react';
import { Ghost, User, Lock, ArrowRight, ChefHat, Sparkles, Utensils, MapPin, X, Info, Flame, Crown } from 'lucide-react';
import { Role, UserAccount } from '../types';

interface LandingPageProps {
  onLogin: (name: string, role: Role, username?: string) => void;
  onVerifyStaff: (username: string, password: string) => Promise<UserAccount | null>;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onVerifyStaff }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));

    if (isLoginMode) {
      if (!username || !password) {
        setError('Por favor completa todos los campos.');
        setLoading(false);
        return;
      }

      const user = await onVerifyStaff(username, password);
      if (user) {
        onLogin(user.name, user.role, user.username);
      } else {
        setError('Credenciales incorrectas. Intenta de nuevo.');
        setLoading(false);
      }
    } else {
      if (!guestName.trim()) {
        setError('Por favor ingresa tu nombre para continuar.');
        setLoading(false);
        return;
      }
      onLogin(guestName, 'guest');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black font-sans text-slate-100">

      {/* BACKGROUND IMAGE WITH PARALLAX */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-200 ease-out"
        style={{
          transform: `scale(1.1) translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)`,
          backgroundImage: 'url("https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900/90 to-slate-900/70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-orange-600/20 to-transparent"></div>
      </div>

      {/* FIRE EMBERS ANIMATION */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <style>{`
           @keyframes rise-ember {
             0% { transform: translateY(100vh) scale(0); opacity: 0; }
             10% { opacity: 1; }
             100% { transform: translateY(-10vh) scale(1); opacity: 0; margin-left: -20px; }
           }
           .ember {
             position: absolute;
             bottom: -10px;
             border-radius: 50%;
             background: radial-gradient(circle, #ffb347 0%, #ff4500 100%);
             box-shadow: 0 0 10px 2px rgba(255, 69, 0, 0.6);
             animation: rise-ember linear infinite;
           }
         `}</style>
        {[...Array(20)].map((_, i) => {
          const left = Math.random() * 100;
          const size = Math.random() * 4 + 2;
          const duration = Math.random() * 5 + 3;
          const delay = Math.random() * 5;
          return (
            <div
              key={i}
              className="ember"
              style={{
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`
              }}
            />
          );
        })}
      </div>

      {/* SMOKE/ASH ANIMATION */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <style>{`
           @keyframes rise-smoke {
             0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
             10% { opacity: 0.4; }
             100% { transform: translateY(-20vh) scale(1.8); opacity: 0; }
           }
           .smoke {
             position: absolute;
             bottom: -50px;
             border-radius: 50%;
             background: radial-gradient(circle, rgba(220,220,220,0.2), transparent);
             filter: blur(25px);
             animation: rise-smoke ease-in-out infinite;
           }
         `}</style>
        {[...Array(10)].map((_, i) => {
          const left = Math.random() * 100;
          const size = Math.random() * 60 + 50;
          const duration = Math.random() * 8 + 8;
          const delay = Math.random() * 8;
          return (
            <div
              key={`smoke-${i}`}
              className="smoke"
              style={{
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`
              }}
            />
          );
        })}
      </div>

      {/* TOP RIGHT GHOST BUTTON */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setShowStory(true)}
          className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          <div className="relative">
            <Ghost size={20} className="text-slate-300 group-hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
          </div>
          <span className="text-xs font-bold text-slate-300 group-hover:text-white tracking-widest uppercase">La Leyenda</span>
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-6 items-center h-full lg:h-auto overflow-y-auto lg:overflow-visible">

        {/* LEFT COLUMN: BRANDING */}
        <div className="text-center lg:text-left space-y-6 pt-10 lg:pt-0">
          <div className="inline-flex items-center justify-center p-4 bg-orange-500/10 rounded-full border border-orange-500/20 backdrop-blur-md animate-pulse">
            <Flame size={48} className="text-orange-500" fill="currentColor" fillOpacity={0.5} />
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter drop-shadow-2xl">
            FOOD<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              TRACK
            </span>
          </h1>

          <div className="flex flex-col gap-3 text-slate-300 text-lg font-medium max-w-lg mx-auto lg:mx-0">
            <p className="flex items-center justify-center lg:justify-start gap-2">
              <Crown size={20} className="text-orange-500" />
              <span>Por orden del Rey Fantasma</span>
            </p>
            <p className="text-sm text-slate-400 italic">
              "Sabores tan intensos que despertarían a los muertos."
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM */}
        <div className="w-full max-w-md mx-auto" style={{ perspective: '1000px' }}>
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:border-orange-500/30 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <div className="flex bg-black/40 rounded-xl p-1 mb-8 relative border border-white/5">
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg transition-all duration-300 ease-out shadow-lg ${isLoginMode ? 'left-1' : 'left-[calc(50%+4px)]'}`}
              ></div>
              <button
                onClick={() => { setIsLoginMode(true); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg relative z-10 font-bold text-sm transition-colors duration-300 ${isLoginMode ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <ChefHat size={16} /> Staff
              </button>
              <button
                onClick={() => { setIsLoginMode(false); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg relative z-10 font-bold text-sm transition-colors duration-300 ${!isLoginMode ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Sparkles size={16} /> Invitado
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
                {isLoginMode ? 'Acceso Privado' : 'Solo Mirar'}
              </h2>
              <p className="text-slate-400 text-sm">
                {isLoginMode ? 'Ingresa tus credenciales de cocina.' : 'Si entras como invitado, no podrás ordenar.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isLoginMode ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-orange-500 uppercase tracking-widest ml-1">Usuario</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors">
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:bg-black/60 focus:ring-1 focus:ring-orange-500/50 transition-all font-medium"
                        placeholder="Ej. ChefAdmin"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-orange-500 uppercase tracking-widest ml-1">Contraseña</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors">
                        <Lock size={20} />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:bg-black/60 focus:ring-1 focus:ring-orange-500/50 transition-all font-medium"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-orange-500 uppercase tracking-widest ml-1">Tu Nombre</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors">
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:bg-black/60 focus:ring-1 focus:ring-orange-500/50 transition-all font-medium"
                        placeholder="Ej. Curioso Mortal"
                      />
                    </div>
                  </div>
                  <div className="text-xs text-orange-300/80 italic text-center px-4">
                    "Advertencia: Al entrar sin credenciales, serás condenado a ver el menú y quedarte con las ganas."
                  </div>
                </>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-sm p-3 rounded-lg text-center flex items-center justify-center gap-2 animate-[pulse_3s_ease-in-out_infinite]">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/40 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-6 border border-white/5"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  <>
                    {isLoginMode ? 'Ingresar al Sistema' : 'Entrar a Sufrir'}
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* STORY MODAL */}
      {showStory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">

            <button
              onClick={() => setShowStory(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-black/20 hover:bg-white/10 p-2 rounded-full transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop")' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
              <div className="absolute bottom-6 left-8">
                <div className="flex items-center gap-2 text-orange-500 mb-2">
                  <Crown size={24} />
                  <span className="uppercase tracking-widest font-bold text-xs">La Leyenda</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white italic">El Capricho del Rey</h2>
              </div>
            </div>

            <div className="p-8 overflow-y-auto text-slate-300 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Ghost size={20} className="text-orange-500" />
                  El Hambre Eterna
                </h3>
                <p className="leading-relaxed text-sm">
                  Hace eones, el <strong>Rey Fantasma</strong> se aburrió de los banquetes de niebla y ceniza del inframundo.
                  Su hambre no era física, sino espiritual. Deseaba el <em>crunsh</em> de una fritura perfecta, el aroma del queso derretido,
                  el calor del fuego vivo.
                </p>
              </div>

              <div className="border-l-2 border-orange-500 pl-4 py-1 my-6 bg-orange-500/5 rounded-r-lg">
                <p className="text-white font-medium italic">
                  "Si no puedo ir al mundo de los vivos a comer, traeré sus sabores a mi reino", decretó el Rey.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Flame size={20} className="text-red-500" />
                  El Nacimiento de FoodTrack
                </h3>
                <p className="leading-relaxed text-sm">
                  Así nació esta Cocina Fantasma (Dark Kitchen). Ubicada en una grieta dimensional, servimos tanto a espectros hambrientos
                  como a mortales afortunados. No tenemos mesas porque el Rey detesta el ruido de los comensales.
                </p>
                <p className="leading-relaxed text-sm mt-3">
                  Solo cocinamos. Perfeccionamos cada hamburguesa y cada pizza como una ofrenda. Cuando pides aquí, estás probando
                  la comida digna de la realeza del más allá.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 text-center">
                <button
                  onClick={() => setShowStory(false)}
                  className="text-orange-500 hover:text-orange-400 font-bold text-sm tracking-widest uppercase transition-colors"
                >
                  Cerrar Archivo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
