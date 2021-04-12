# city-report
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
