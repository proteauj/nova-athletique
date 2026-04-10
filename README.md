# Nova Athlétique starter

## Frontend
```bash
cd frontend
npm install
npm run dev
```

## Backend
```bash
cd backend
dotnet restore
dotnet run
```

## Base de données
```bash
psql -U postgres -d nova -f database/init.sql
```


## Hero vidéo
Le hero utilise maintenant un composant vidéo propre.
Ajoute ton fichier ici :
`frontend/public/videos/hero.mp4`

La page retombera sur l'image poster si la vidéo n'est pas encore présente.
