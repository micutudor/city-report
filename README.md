# city-report
## Prezentare
Aplicatia City Report este o solutie dezvoltata in React Native pentru a face relatia dintre cetateni si autoritatile locale mult mai usoara. Aplicatia prezinta urmatoarele pagini:
* Sesizare noua - Cetatenii pot deschide o sesizare la locatia curenta sau alegand un punct de pe harta ori cautand locatia dorita folosind bara de cautare. Sesizarea poate fii deschisa pe raza UAT (in acest caz, municipiul Barlad). Acestia trebuie sa aleg
* Sesizarile mele - Pe aceasta pagina sunt afisate toate sesizarile deschise de utilizator. Sesizarile ce au primit raspuns prezinta un chenar verde, celelalte fiind marcate cu rosu. De altfel utilizatorii pot sterge sesizarile, sau pot vedea mai multe detalii despre sesizarea in cauza precum numarul de inregistrare, descriere sau daca este cazul, raspunsul autoritatilor.
* Harta sesizari - Harta ce prezinta toate sesizarile din oras. Cele rezolvate au un marker verde, respectiv unul rosu pentru cele fara raspuns. Apasand pe marker utilizatorii pot vedea mai multe informatii despre sesizarea in cauza.
* Buletin de stiri - Administratorii pot posta (din API - vezi mai jos) stiri. Stirile pot fi insotite si de o imagine.

In dezvoltarea aplicatiei au fost folosite urmatoarele dependinte:
* react-native-async-storage/async-storage - stocarea cheiei de autentificare
* react-native-community/masked-view
* react-native-picker/picker - picker pentru selectarea categoriei
* react-navigation/bottom-tabs
* react-navigation/native
* react-navigation/stack
* expo
* expo-image-picker - acces la functionalitatea nativa pentru galerie.
* expo-location - acces la functionalitatea nativa pentru geolocalizare.
* expo-status-bar
* geolib - este folosita functia isPointInPolygon pentru a verifica daca marker-ul pentru a deschide o sesizare noua se afla in raza UAT.
* react
* react-dom
* react-native
* react-native-gesture-handler
* react-native-keyboard-adaptable-view
* react-native-maps
* react-native-modal
* react-native-reanimated
* react-native-safe-area-context
* react-native-screens
* react-native-vector-icons
* react-native-web

## Install
Run
```bash
npm install
expo start
```
Or access from [here](https://expo.io/@tud0r/projects/esesizari).
## API
### Create news
```url
POST https://api.inorog.org/api/news/publish.php?session_key=dIzVAzIHBWwfa7G3QihJFbpjd1kNggye
```
JSON
```json
{
	"header": "Investitii in reabilitarea scolilor",
	"text": "Primaria a alocat suma de 1.000.000 lei pentru repararea a 2 scoli din oras.",
	"photo_path": "https://www.scoalavasileparvan.ro/wp-content/uploads/2017/11/local_vechi_sc2_673w.jpg"
}
```
### Answer reports
```url
POST https://api.inorog.org/api/complaint/answer.php?id=[complaint_id]&session_key=dIzVAzIHBWwfa7G3QihJFbpjd1kNggye
```
JSON
```json
{
	"text": "Becul a fost inlocuit, multumim de sesizare!",
}
```
