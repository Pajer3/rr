# Frisspits factuursysteem (in de website)

Het factuursysteem zit nu **beveiligd** in de website. Alleen met jouw wachtwoord kom je erbij.

## Starten

1. Dubbelklik op **`Start Frisspits Website.bat`** (of open een terminal in deze map en typ `npm run dev`).
2. Open in je browser: **http://localhost:3000/admin/facturen**
3. Log in met je wachtwoord.

Daarna zie je drie schermen bovenin:
- **Factuur maken** – notitie plakken → regels controleren → PDF maken → e-mail klaarzetten.
- **Facturen versturen** – overzicht van alle gemaakte facturen met het bewaarde bericht per klant.
- **E-mailhandtekening** – je handtekening om in Gmail / iCloud / op je iPhone in te stellen.

Rechtsboven kun je **uitloggen**.

## Je wachtwoord veranderen

Log in en klik bovenin op **Wachtwoord**. Typ je huidige wachtwoord en twee keer je
nieuwe wachtwoord, en klik op opslaan. Klaar.

Je wachtwoord wordt **versleuteld (gehasht)** bewaard in `data/facturen/wachtwoord-hash.txt`.
Daar staat alleen een onleesbare reeks tekens — niemand kan je wachtwoord eruit aflezen,
ook niet als hij bij je bestanden kan.

## Waar staan mijn gegevens?

Alles staat lokaal op deze pc, in de map `data/facturen/`:
- `company.json` – je bedrijfsgegevens, logo en het eerstvolgende factuurnummer.
- `customers.json` – je klanten en hun bewaarde factuurberichten.
- `invoices.json` – de lijst met gemaakte facturen.

De gemaakte PDF's staan in de map `factuur-output/`.

Deze mappen staan **niet** in git en worden dus niet online gezet — ze blijven privé op je pc.

## Beveiliging — hoe werkt het?

- Zonder inloggen word je automatisch naar de loginpagina gestuurd; de gegevens (API) geven dan niets vrij.
- Na inloggen krijg je een beveiligde cookie die 30 dagen geldig is.
- Je wachtwoord en je klantgegevens staan alleen op je eigen pc.
