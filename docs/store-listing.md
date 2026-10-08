# Beschreibung für den Chrome Web Store

Entwurf für Version 0.1.0. Noch nicht eingereicht.

## Name

Classic Watch Layout

## Kurzbeschreibung

Stellt die klassische YouTube-Videoansicht und Kinomodus-Auswahl wieder her. Ohne Tracking.

## Beschreibung

Classic Watch Layout aktiviert die in YouTube noch vorhandene klassische Videoansicht. Die Erweiterung richtet sich an Desktop-Nutzer, bei denen eine neue Layoutvariante die gewohnte Ansicht oder Kinomodus-Auswahl verändert hat.

- Wirkt automatisch auf www.youtube.com, ohne Popup oder zusätzliche Einrichtung.
- Ändert nur ausgewählte Layout-Einstellungen im Speicher der geöffneten Seite.
- Keine Kontozugriffe, Cookies, Speicherung von Nutzungsdaten oder Tracking.
- Keine eigenen Netzwerkverbindungen und kein nachgeladener Programmcode.

Nach der Installation bereits geöffnete YouTube-Tabs neu laden. Zum Rückgängigmachen die Erweiterung deaktivieren oder entfernen und YouTube erneut laden.

Die Erweiterung setzt voraus, dass YouTube die klassischen Ansichtskomponenten weiterhin bereitstellt. Je nach Konto und YouTube-Version kann die Wirkung abweichen. Vollbild und automatische Wiedergabe werden nicht erzwungen.

Unabhängiges Projekt, nicht mit YouTube oder Google verbunden.

## Angaben zum Zweck und zu Berechtigungen

**Einziger Zweck:** Die klassische YouTube-Videoansicht und Kinomodus-Auswahl wiederherstellen.

**Zugriff auf https://www.youtube.com/*:** Das Content Script muss vor dem Seitencode geladen werden, um die Layout-Konfiguration zu setzen. Es läuft nur im Hauptdokument auf diesem Host; andere Websites und eingebettete Frames werden nicht verändert.

**MAIN-Welt:** Die zu ändernden Konfigurationsobjekte gehören zur YouTube-Seite und sind aus der isolierten Erweiterungswelt nicht direkt erreichbar. Deshalb läuft das Script im Seitenkontext. Es fordert keine zusätzlichen Erweiterungs-API-Berechtigungen an.

**Remote-Code:** Der gesamte ausführbare Code ist im Erweiterungspaket enthalten. Es gibt keine Remote-Skripte, dynamischen Code-Downloads oder externen Imports.

**Datennutzung:** Die Erweiterung erhebt, speichert oder übermittelt keine personenbezogenen Daten. Die Angaben im Dashboard sind vor der Einreichung mit dem endgültigen Paket abzugleichen.

## Links

- Projekt: https://github.com/ctrwins/classic-watch-layout
- Support: https://github.com/ctrwins/classic-watch-layout/issues
- Datenschutzentwurf: https://github.com/ctrwins/classic-watch-layout/blob/main/docs/privacy.md

## Vor der Einreichung ergänzen

- Verantwortliche Kontaktadresse in der Datenschutzerklärung und im Entwickler-Dashboard.
- Erweiterungsicon, Store-Screenshots und Werbegrafik gemäß der aktuellen [Store-Checkliste](store-release.md).
- Abschließende Verträglichkeitstests und Prüfung des Upload-Pakets.
- Entwicklerkonto, erforderliche Kontoverifizierung und Registrierungsgebühr.

Die öffentliche Sichtbarkeit des Quellcodes ersetzt keine Lizenzentscheidung und keine Prüfung durch den Chrome Web Store.
