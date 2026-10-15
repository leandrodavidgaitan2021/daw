'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search">
    <input type="text" placeholder="Type to search">
    <button type="button"
        class="search-input-clear"
        aria-label="Clear search"
        data-search-input-clear>&times;</button>
</div>
` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="architecture.html" data-type="chapter-link">
                                        <span class="icon ion-ios-git-branch"></span>Architecture
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-c8dd17a3f6d7b3a2323fffdcfbac767b218e3557c80e2f95eb7c75c1181dff2dfde01d1a2a0a20b00355b529dc4930686eed495dc9960115f0fc010f6bc9d7ec"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-c8dd17a3f6d7b3a2323fffdcfbac767b218e3557c80e2f95eb7c75c1181dff2dfde01d1a2a0a20b00355b529dc4930686eed495dc9960115f0fc010f6bc9d7ec"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-c8dd17a3f6d7b3a2323fffdcfbac767b218e3557c80e2f95eb7c75c1181dff2dfde01d1a2a0a20b00355b529dc4930686eed495dc9960115f0fc010f6bc9d7ec"' :
                                            'id="xs-controllers-links-module-AuthModule-c8dd17a3f6d7b3a2323fffdcfbac767b218e3557c80e2f95eb7c75c1181dff2dfde01d1a2a0a20b00355b529dc4930686eed495dc9960115f0fc010f6bc9d7ec"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-c8dd17a3f6d7b3a2323fffdcfbac767b218e3557c80e2f95eb7c75c1181dff2dfde01d1a2a0a20b00355b529dc4930686eed495dc9960115f0fc010f6bc9d7ec"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-c8dd17a3f6d7b3a2323fffdcfbac767b218e3557c80e2f95eb7c75c1181dff2dfde01d1a2a0a20b00355b529dc4930686eed495dc9960115f0fc010f6bc9d7ec"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-c8dd17a3f6d7b3a2323fffdcfbac767b218e3557c80e2f95eb7c75c1181dff2dfde01d1a2a0a20b00355b529dc4930686eed495dc9960115f0fc010f6bc9d7ec"' :
                                        'id="xs-injectables-links-module-AuthModule-c8dd17a3f6d7b3a2323fffdcfbac767b218e3557c80e2f95eb7c75c1181dff2dfde01d1a2a0a20b00355b529dc4930686eed495dc9960115f0fc010f6bc9d7ec"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GestionModule.html" data-type="entity-link" >GestionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-GestionModule-9a2fe3f578c94cbe4e4d22b5cd0a3bec199aa01f15ae0299e01c5ce45e75d4d87329391ec6043a1d9662220c17770d0f0298d63836c200003db72326ffa1d556"' : 'data-bs-target="#xs-controllers-links-module-GestionModule-9a2fe3f578c94cbe4e4d22b5cd0a3bec199aa01f15ae0299e01c5ce45e75d4d87329391ec6043a1d9662220c17770d0f0298d63836c200003db72326ffa1d556"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GestionModule-9a2fe3f578c94cbe4e4d22b5cd0a3bec199aa01f15ae0299e01c5ce45e75d4d87329391ec6043a1d9662220c17770d0f0298d63836c200003db72326ffa1d556"' :
                                            'id="xs-controllers-links-module-GestionModule-9a2fe3f578c94cbe4e4d22b5cd0a3bec199aa01f15ae0299e01c5ce45e75d4d87329391ec6043a1d9662220c17770d0f0298d63836c200003db72326ffa1d556"' }>
                                            <li class="link">
                                                <a href="controllers/MedicosController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MedicosController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ReservasController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReservasController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UsuariosController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsuariosController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-GestionModule-9a2fe3f578c94cbe4e4d22b5cd0a3bec199aa01f15ae0299e01c5ce45e75d4d87329391ec6043a1d9662220c17770d0f0298d63836c200003db72326ffa1d556"' : 'data-bs-target="#xs-injectables-links-module-GestionModule-9a2fe3f578c94cbe4e4d22b5cd0a3bec199aa01f15ae0299e01c5ce45e75d4d87329391ec6043a1d9662220c17770d0f0298d63836c200003db72326ffa1d556"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GestionModule-9a2fe3f578c94cbe4e4d22b5cd0a3bec199aa01f15ae0299e01c5ce45e75d4d87329391ec6043a1d9662220c17770d0f0298d63836c200003db72326ffa1d556"' :
                                        'id="xs-injectables-links-module-GestionModule-9a2fe3f578c94cbe4e4d22b5cd0a3bec199aa01f15ae0299e01c5ce45e75d4d87329391ec6043a1d9662220c17770d0f0298d63836c200003db72326ffa1d556"' }>
                                        <li class="link">
                                            <a href="injectables/MedicosService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MedicosService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ReservasService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReservasService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsuariosService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsuariosService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Medico.html" data-type="entity-link" >Medico</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Reserva.html" data-type="entity-link" >Reserva</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Usuario.html" data-type="entity-link" >Usuario</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ActualizarEstadoReservaDto.html" data-type="entity-link" >ActualizarEstadoReservaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CrearReservaDto.html" data-type="entity-link" >CrearReservaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FiltrarTurnosMedicoDto.html" data-type="entity-link" >FiltrarTurnosMedicoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginResponseDto.html" data-type="entity-link" >LoginResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginUsuarioDto.html" data-type="entity-link" >LoginUsuarioDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MedicoResponseDto.html" data-type="entity-link" >MedicoResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModificarValorConsultaDto.html" data-type="entity-link" >ModificarValorConsultaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReservaResponseDto.html" data-type="entity-link" >ReservaResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsuarioResponseDto.html" data-type="entity-link" >UsuarioResponseDto</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/UsuarioAutenticado.html" data-type="entity-link" >UsuarioAutenticado</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
