import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const translations = {
  en: {
    home: 'Home', chat: 'Chat', explore: 'Explore', profile: 'Profile', settings: 'Settings',
    post: 'Post', like: 'Like', comment: 'Comment', share: 'Share', follow: 'Follow',
    following: 'Following', followers: 'Followers', editProfile: 'Edit Profile', logout: 'Logout',
    search: 'Search', notifications: 'Notifications', studyHub: 'Study Hub', events: 'Events',
    marketplace: 'Marketplace', groups: 'Groups', achievements: 'Achievements', anonymous: 'Anonymous Board',
    campusMap: 'Campus Map', courses: 'Courses', darkMode: 'Dark Mode', lightMode: 'Light Mode',
    language: 'Language', privacy: 'Privacy', help: 'Help & Support', emergency: 'Emergency Alert',
    loading: 'Loading...', noResults: 'No results found', seeAll: 'See All', create: 'Create',
    cancel: 'Cancel', save: 'Save', delete: 'Delete', confirm: 'Confirm', back: 'Back',
    next: 'Next', done: 'Done', today: 'Today', yesterday: 'Yesterday', thisWeek: 'This Week',
    trending: 'Trending', popular: 'Popular', new: 'New', topRated: 'Top Rated', nearby: 'Nearby',
    online: 'Online', offline: 'Offline', typing: 'typing...', sent: 'Sent', delivered: 'Delivered',
    read: 'Read', reply: 'Reply', forward: 'Forward', copy: 'Copy', report: 'Report', block: 'Block',
    unblock: 'Unblock', mute: 'Mute', unmute: 'Unmute', archive: 'Archive', unarchive: 'Unarchive',
    pin: 'Pin', unpin: 'Unpin', bookmark: 'Bookmark', removeBookmark: 'Remove Bookmark',
    filter: 'Filter', sort: 'Sort', all: 'All', mine: 'Mine', saved: 'Saved', drafts: 'Drafts',
    scheduled: 'Scheduled', published: 'Published', pending: 'Pending', approved: 'Approved',
    rejected: 'Rejected', underReview: 'Under Review', verified: 'Verified', unverified: 'Unverified',
    public: 'Public', private: 'Private', friends: 'Friends', onlyMe: 'Only Me', custom: 'Custom',
    everyone: 'Everyone', peopleIFollow: 'People I Follow', myFollowers: 'My Followers', mutuals: 'Mutuals',
    noOne: 'No One', allowMessages: 'Allow Messages From', allowTags: 'Allow Tags From',
    allowMentions: 'Allow Mentions From', showActivity: 'Show Activity Status',
    showReadReceipts: 'Show Read Receipts', showProfile: 'Show Profile In Search',
    allowFollow: 'Allow People to Follow Me', dataDownload: 'Download My Data',
    dataDelete: 'Delete My Account', passwordChange: 'Change Password', emailChange: 'Change Email',
    phoneChange: 'Change Phone', twoFactor: 'Two-Factor Authentication', loginHistory: 'Login History',
    activeSessions: 'Active Sessions', trustedDevices: 'Trusted Devices',
    blockedAccounts: 'Blocked Accounts', mutedAccounts: 'Muted Accounts',
    restrictedAccounts: 'Restricted Accounts', closeFriends: 'Close Friends', favorites: 'Favorites',
    lists: 'Lists', topics: 'Topics', interests: 'Interests', skills: 'Skills',
    coursesTaken: 'Courses Taken', currentlyStudying: 'Currently Studying', graduationYear: 'Graduation Year',
    major: 'Major', minor: 'Minor', gpa: 'GPA', studentId: 'Student ID', dorm: 'Dorm / Residence',
    roomNumber: 'Room Number', mealPlan: 'Meal Plan', parkingPermit: 'Parking Permit',
    bikeRegistration: 'Bike Registration', libraryCard: 'Library Card', gymMembership: 'Gym Membership',
    healthInsurance: 'Health Insurance', emergencyContact: 'Emergency Contact', bloodType: 'Blood Type',
    allergies: 'Allergies', medications: 'Medications', disabilities: 'Disabilities',
    accommodations: 'Accommodations', preferredName: 'Preferred Name', pronouns: 'Pronouns',
    gender: 'Gender', birthday: 'Birthday', hometown: 'Hometown', state: 'State', country: 'Country',
    timezone: 'Timezone', languages: 'Languages', bio: 'Bio', website: 'Website',
    linkedin: 'LinkedIn', github: 'GitHub', twitter: 'Twitter', instagram: 'Instagram',
    facebook: 'Facebook', snapchat: 'Snapchat', tiktok: 'TikTok', youtube: 'YouTube',
    twitch: 'Twitch', discord: 'Discord', spotify: 'Spotify',
  },
  es: {
    home: 'Inicio', chat: 'Chat', explore: 'Explorar', profile: 'Perfil', settings: 'Configuración',
    post: 'Publicar', like: 'Me gusta', comment: 'Comentar', share: 'Compartir', follow: 'Seguir',
    following: 'Siguiendo', followers: 'Seguidores', editProfile: 'Editar Perfil', logout: 'Cerrar sesión',
    search: 'Buscar', notifications: 'Notificaciones', studyHub: 'Centro de Estudio', events: 'Eventos',
    marketplace: 'Mercado', groups: 'Grupos', achievements: 'Logros', anonymous: 'Tablero Anónimo',
    campusMap: 'Mapa del Campus', courses: 'Cursos', darkMode: 'Modo Oscuro', lightMode: 'Modo Claro',
    language: 'Idioma', privacy: 'Privacidad', help: 'Ayuda y Soporte', emergency: 'Alerta de Emergencia',
    loading: 'Cargando...', noResults: 'No se encontraron resultados', seeAll: 'Ver Todo', create: 'Crear',
    cancel: 'Cancelar', save: 'Guardar', delete: 'Eliminar', confirm: 'Confirmar', back: 'Atrás',
    next: 'Siguiente', done: 'Hecho', today: 'Hoy', yesterday: 'Ayer', thisWeek: 'Esta Semana',
    trending: 'Tendencias', popular: 'Popular', new: 'Nuevo', topRated: 'Mejor Valorado', nearby: 'Cercano',
    online: 'En línea', offline: 'Desconectado', typing: 'escribiendo...', sent: 'Enviado',
    delivered: 'Entregado', read: 'Leído', reply: 'Responder', forward: 'Reenviar', copy: 'Copiar',
    report: 'Reportar', block: 'Bloquear', unblock: 'Desbloquear', mute: 'Silenciar', unmute: 'Activar sonido',
    archive: 'Archivar', unarchive: 'Desarchivar', pin: 'Fijar', unpin: 'Desfijar',
    bookmark: 'Guardar', removeBookmark: 'Quitar guardado', filter: 'Filtrar', sort: 'Ordenar',
    all: 'Todo', mine: 'Mío', saved: 'Guardado', drafts: 'Borradores', scheduled: 'Programado',
    published: 'Publicado', pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado',
    underReview: 'En Revisión', verified: 'Verificado', unverified: 'No Verificado', public: 'Público',
    private: 'Privado', friends: 'Amigos', onlyMe: 'Solo Yo', custom: 'Personalizado',
    everyone: 'Todos', peopleIFollow: 'Personas que Sigo', myFollowers: 'Mis Seguidores',
    mutuals: 'Mutuos', noOne: 'Nadie', allowMessages: 'Permitir Mensajes De', allowTags: 'Permitir Etiquetas De',
    allowMentions: 'Permitir Menciones De', showActivity: 'Mostrar Estado de Actividad',
    showReadReceipts: 'Mostrar Confirmaciones de Lectura', showProfile: 'Mostrar Perfil en Búsqueda',
    allowFollow: 'Permitir que la Gente me Siga', dataDownload: 'Descargar Mis Datos',
    dataDelete: 'Eliminar Mi Cuenta', passwordChange: 'Cambiar Contraseña', emailChange: 'Cambiar Correo',
    phoneChange: 'Cambiar Teléfono', twoFactor: 'Autenticación de Dos Factores',
    loginHistory: 'Historial de Inicio de Sesión', activeSessions: 'Sesiones Activas',
    trustedDevices: 'Dispositivos de Confianza', blockedAccounts: 'Cuentas Bloqueadas',
    mutedAccounts: 'Cuentas Silenciadas', restrictedAccounts: 'Cuentas Restringidas',
    closeFriends: 'Amigos Cercanos', favorites: 'Favoritos', lists: 'Listas', topics: 'Temas',
    interests: 'Intereses', skills: 'Habilidades', coursesTaken: 'Cursos Tomados',
    currentlyStudying: 'Estudiando Actualmente', graduationYear: 'Año de Graduación',
    major: 'Carrera Principal', minor: 'Carrera Secundaria', gpa: 'Promedio', studentId: 'ID de Estudiante',
    dorm: 'Residencia', roomNumber: 'Número de Cuarto', mealPlan: 'Plan de Comidas',
    parkingPermit: 'Permiso de Estacionamiento', bikeRegistration: 'Registro de Bicicleta',
    libraryCard: 'Tarjeta de Biblioteca', gymMembership: 'Membresía de Gimnasio',
    healthInsurance: 'Seguro de Salud', emergencyContact: 'Contacto de Emergencia',
    bloodType: 'Tipo de Sangre', allergies: 'Alergias', medications: 'Medicamentos',
    disabilities: 'Discapacidades', accommodations: 'Acomodaciones', preferredName: 'Nombre Preferido',
    pronouns: 'Pronombres', gender: 'Género', birthday: 'Cumpleaños', hometown: 'Ciudad Natal',
    state: 'Estado', country: 'País', timezone: 'Zona Horaria', languages: 'Idiomas', bio: 'Biografía',
    website: 'Sitio Web', linkedin: 'LinkedIn', github: 'GitHub', twitter: 'Twitter',
    instagram: 'Instagram', facebook: 'Facebook', snapchat: 'Snapchat', tiktok: 'TikTok',
    youtube: 'YouTube', twitch: 'Twitch', discord: 'Discord', spotify: 'Spotify',
  },
  fr: {
    home: 'Accueil', chat: 'Chat', explore: 'Explorer', profile: 'Profil', settings: 'Paramètres',
    post: 'Publier', like: 'J\'aime', comment: 'Commenter', share: 'Partager', follow: 'Suivre',
    following: 'Suivis', followers: 'Abonnés', editProfile: 'Modifier le Profil', logout: 'Déconnexion',
    search: 'Rechercher', notifications: 'Notifications', studyHub: 'Centre d\'Étude', events: 'Événements',
    marketplace: 'Marché', groups: 'Groupes', achievements: 'Réalisations', anonymous: 'Tableau Anonyme',
    campusMap: 'Carte du Campus', courses: 'Cours', darkMode: 'Mode Sombre', lightMode: 'Mode Clair',
    language: 'Langue', privacy: 'Confidentialité', help: 'Aide et Support', emergency: 'Alerte d\'Urgence',
    loading: 'Chargement...', noResults: 'Aucun résultat trouvé', seeAll: 'Voir Tout', create: 'Créer',
    cancel: 'Annuler', save: 'Enregistrer', delete: 'Supprimer', confirm: 'Confirmer', back: 'Retour',
    next: 'Suivant', done: 'Terminé', today: 'Aujourd\'hui', yesterday: 'Hier', thisWeek: 'Cette Semaine',
    trending: 'Tendances', popular: 'Populaire', new: 'Nouveau', topRated: 'Mieux Noté', nearby: 'Proche',
    online: 'En ligne', offline: 'Hors ligne', typing: 'écrit...', sent: 'Envoyé', delivered: 'Livré',
    read: 'Lu', reply: 'Répondre', forward: 'Transférer', copy: 'Copier', report: 'Signaler',
    block: 'Bloquer', unblock: 'Débloquer', mute: 'Rendre muet', unmute: 'Réactiver le son',
    archive: 'Archiver', unarchive: 'Désarchiver', pin: 'Épingler', unpin: 'Désépingler',
    bookmark: 'Marquer', removeBookmark: 'Retirer le marque', filter: 'Filtrer', sort: 'Trier',
    all: 'Tout', mine: 'Le mien', saved: 'Enregistré', drafts: 'Brouillons', scheduled: 'Programmé',
    published: 'Publié', pending: 'En attente', approved: 'Approuvé', rejected: 'Rejeté',
    underReview: 'En Révision', verified: 'Vérifié', unverified: 'Non Vérifié', public: 'Public',
    private: 'Privé', friends: 'Amis', onlyMe: 'Seulement Moi', custom: 'Personnalisé',
    everyone: 'Tout le monde', peopleIFollow: 'Personnes que je Suis', myFollowers: 'Mes Abonnés',
    mutuals: 'Mutuels', noOne: 'Personne', allowMessages: 'Autoriser les Messages de',
    allowTags: 'Autoriser les Étiquettes de', allowMentions: 'Autoriser les Mentions de',
    showActivity: 'Afficher le Statut d\'Activité', showReadReceipts: 'Afficher les Accusés de Réception',
    showProfile: 'Afficher le Profil dans la Recherche', allowFollow: 'Autoriser les Gens à me Suivre',
    dataDownload: 'Télécharger mes Données', dataDelete: 'Supprimer mon Compte',
    passwordChange: 'Changer le Mot de Passe', emailChange: 'Changer l\'Email',
    phoneChange: 'Changer le Téléphone', twoFactor: 'Authentification à Deux Facteurs',
    loginHistory: 'Historique de Connexion', activeSessions: 'Sessions Actives',
    trustedDevices: 'Appareils de Confiance', blockedAccounts: 'Comptes Bloqués',
    mutedAccounts: 'Comptes Muets', restrictedAccounts: 'Comptes Restreints',
    closeFriends: 'Amis Proches', favorites: 'Favoris', lists: 'Listes', topics: 'Sujets',
    interests: 'Intérêts', skills: 'Compétences', coursesTaken: 'Cours Suivis',
    currentlyStudying: 'Étudie Actuellement', graduationYear: 'Année d\'Obtention du Diplôme',
    major: 'Majeure', minor: 'Mineure', gpa: 'Moyenne', studentId: 'ID Étudiant',
    dorm: 'Résidence', roomNumber: 'Numéro de Chambre', mealPlan: 'Plan de Repas',
    parkingPermit: 'Permis de Stationnement', bikeRegistration: 'Enregistrement de Vélo',
    libraryCard: 'Carte de Bibliothèque', gymMembership: 'Adhésion au Gymnase',
    healthInsurance: 'Assurance Maladie', emergencyContact: 'Contact d\'Urgence',
    bloodType: 'Groupe Sanguin', allergies: 'Allergies', medications: 'Médicaments',
    disabilities: 'Handicaps', accommodations: 'Aménagements', preferredName: 'Nom Préféré',
    pronouns: 'Pronoms', gender: 'Genre', birthday: 'Anniversaire', hometown: 'Ville Natale',
    state: 'État', country: 'Pays', timezone: 'Fuseau Horaire', languages: 'Langues', bio: 'Bio',
    website: 'Site Web', linkedin: 'LinkedIn', github: 'GitHub', twitter: 'Twitter',
    instagram: 'Instagram', facebook: 'Facebook', snapchat: 'Snapchat', tiktok: 'TikTok',
    youtube: 'YouTube', twitch: 'Twitch', discord: 'Discord', spotify: 'Spotify',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages: ['en', 'es', 'fr'] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};