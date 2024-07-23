import 'bootstrap/dist/css/bootstrap.min.css';
import './VistaCiudadano.css';
import fondoNegro from '../assets/images/fondoNegroCarrousel.jpg';
import portada from '../assets/images/imgPortada.png';
import { useEffect, useState } from 'react';
import Sucursal from '../types/Sucursal';
import SucursalCard from '../components/iu/Sucursal/SucursalCard';
import { SucursalGetAll } from '../services/SucursalService';
import { useAuth0 } from '@auth0/auth0-react';

const VistaCiudadano = () => {

  
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const { getAccessTokenSilently } = useAuth0();

    
    const getAllSucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        const sucursales: Sucursal[] = await SucursalGetAll(token);
        setSucursales(sucursales);
    };

    useEffect(() => {
        getAllSucursal();
    }, []);

//revisar y aplicar metodo handleclose
    function handleClose(): void {
        throw new Error('Function not implemented / not available.');
    }

    return (
        <>
         {//IMAGEN PRINCIPAL
                        }
            <div style={{ position: 'relative', width: '100%' }}>
                <img src={portada} alt="Imagen principal" style={{ height: 'auto', width: '100%' }} />
                 {//banner de CATEGORIAS
                        }
                <div style={{
                    position: 'absolute',
                    bottom: '-20px',
                    height: '80px',
                    width: '100%',
                    backgroundColor: '#233044',
                    borderTopLeftRadius: '20px',
                    borderTopRightRadius: '20px'
                }}>
                    
                 <h1 style={{ marginTop: '20px', marginLeft: '30px', color: 'white', fontSize: '1.7rem', textAlign: 'left' }}>Categorías</h1>
                </div>
            </div>
                    {//APARTADO DE CARROUSEL
                        }
            <div style={{ backgroundImage: `url(${fondoNegro})`, backgroundSize: 'cover', width: '100%', height: '500px', display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'left', fontFamily: 'Arial Black' }}>
                    <h1 style={{ lineHeight: '2.0', letterSpacing: '0.15em', color: 'white', fontSize: '3rem', textAlign: 'center' }}>¡ NUESTRAS<br /> VARIEDADES !</h1>
                </div>
                
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div id="carouselExampleIndicators" className="carousel slide rounded" style={{ width: '70%' }}>
                      {/*} <div className="carousel-indicators">
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        </div>*/}
                        <div className="carousel-inner" style={{paddingTop:'30px', paddingBottom: '30px' }}>
                            <div className="carousel-item active">
                                <img src="https://cdn.pixabay.com/photo/2022/08/29/17/45/burger-7419428_1280.jpg" className="d-block mx-auto rounded-circle" alt="..." style={{ width: '300px', height: '300px', border: '5px solid white' }}  onClick={() => window.location.href = '/Menu'}/>
                                <div className="carousel-caption d-block textoCarrousel" style={{ fontSize:'25px', bottom: '-57px', color: 'white', borderRadius: '5px', fontFamily: 'Broadway', textAlign: 'center' }}>
                                Hamburguesas</div>
                            </div>
                            <div className="carousel-item">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVBVWzGmalxoPpuXHvngd9n_J0GkukNrFBTw&s" className="d-block mx-auto rounded-circle" alt="..." style={{ width: '300px', height: '300px', border: '5px solid white' }}  onClick={() => window.location.href = '/Menu'}/>
                                <div className="carousel-caption d-block textoCarrousel" style={{ fontSize:'25px', bottom: '-57px', color: 'white', borderRadius: '5px', fontFamily: 'Broadway', textAlign: 'center' }}>
                                Pizzas</div>
                            </div>
                            <div className="carousel-item">
                                <img src="https://img.freepik.com/free-photo/grilled-sandwich-with-beef-pork-vegetable-generated-by-ai_188544-20918.jpg" className="d-block mx-auto rounded-circle" alt="..." style={{ width: '300px', height: '300px', border: '5px solid white' }}  onClick={() => window.location.href = '/Menu'}/>
                                <div className="carousel-caption d-block textoCarrousel" style={{ fontSize:'25px', bottom: '-57px', color: 'white', borderRadius: '5px', fontFamily: 'Broadway', textAlign: 'center' }}>
                                Lomos</div>
                            </div>

                            <div className="carousel-item">
                                <img src="https://img.freepik.com/fotos-premium/papas-fritas-tocino-queso-cheddar_855892-891.jpg" className="d-block mx-auto rounded-circle" alt="..." style={{ width: '300px', height: '300px', border: '5px solid white' }}  onClick={() => window.location.href = '/Menu'}/>
                                <div className="carousel-caption d-block textoCarrousel" style={{ fontSize:'25px', bottom: '-57px', color: 'white', borderRadius: '5px', fontFamily: 'Broadway', textAlign: 'center' }}>
                                Entradas</div>
                            </div>
                                <div className="carousel-item">
                                <img src="https://img.freepik.com/fotos-premium/hamburguesa-vaso-cerveza-al-lado_995470-685.jpg" className="d-block mx-auto rounded-circle" alt="..." style={{ width: '300px', height: '300px', border: '5px solid white' }} onClick={() => window.location.href = '/Menu'} />
                                <div className="carousel-caption d-block textoCarrousel" style={{ fontSize:'25px', bottom: '-57px', color: 'white', borderRadius: '5px', fontFamily: 'Broadway', textAlign: 'center' }}>
                                Promociones</div>
                            </div>
                            <div className="carousel-item">
                                <img src="https://img.freepik.com/foto-gratis/bebidas-hermosas-refinadas-huespedes_8353-9107.jpg" className="d-block mx-auto rounded-circle" alt="..." style={{ width: '300px', height: '300px', border: '5px solid white' }}  onClick={() => window.location.href = '/Menu'}/>
                                <div className="carousel-caption d-block textoCarrousel" style={{ fontSize:'25px', bottom: '-57px', color: 'white', borderRadius: '5px', fontFamily: 'Broadway', textAlign: 'center' }}>
                                Bebidas y Tragos</div>
                            </div>
                        
                       
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true" style={{ color: 'white' }}></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                    
                </div>
            </div>
             {//banner de SUCURSALES
                        }
            <div style={{
                    bottom: '-30px',
                    height: '80px',
                    width: '100%',
                    backgroundColor: '#233044',
                  
                    paddingTop: '25px', /* Espacio a la izquierda del texto */
                    zIndex: 100 /* Asegura que el banner esté sobre el carrousel */

                }}>
                <h1 style={{ marginLeft: '30px', color: 'white', fontSize: '1.7rem', textAlign: 'left' }}>Sucursales</h1>
            </div>
            <div>
               
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                justifyContent: 'center',
                marginTop: '16px',
                padding: '10px',
            }}>
                {sucursales.map((sucursal) => (
                    <SucursalCard key={sucursal.id} onClose={handleClose} sucursal={sucursal}/>
                ))}
            </div>

                </div>

        </>
    );
};

export default VistaCiudadano;