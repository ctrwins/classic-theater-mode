# Beschreibung für den Chrome Web Store

Entwurf für Version 0.1.0. Noch nicht eingereicht.

## Name

Classic Watch Layout

## Kurzbeschreibung

A small extension that restores the classic theater mode for affected YouTube accounts.

## Beschreibung

A small extension that restores the classic theater mode for affected YouTube accounts.

## Angaben zum Zweck und zu Berechtigungen

**Einziger Zweck:** Die klassische YouTube-Videoansicht und Kinomodus-Auswahl wiederherstellen.

**Zugriff auf https://www.youtube.com/*:** Das Content Script muss vor dem Seitencode geladen werden, um die Layout-Konfiguration zu setzen. Es läuft nur im Hauptdokument auf diesem Host; andere Websites und eingebettete Frames werden nicht verändert.

**MAIN-Welt:** Die zu ändernden Konfigurationsobjekte gehören zur YouTube-Seite und sind aus der isolierten Erweiterungswelt nicht direkt erreichbar. Deshalb läuft das Script im Seitenkontext. Es fordert keine zusätzlichen Erweiterungs-API-Berechtigungen an.

**Remote-Code:** Der gesamte ausführbare Code ist im Erweiterungspaket enthalten. Es gibt keine Remote-Skripte, dynamischen Code-Downloads oder externen Imports.

**Datennutzung:** Die Erweiterung erhebt, speichert oder übermittelt keine personenbezogenen Daten. Die Angaben im Dashboard sind vor der Einreichung mit dem endgültigen Paket abzugleichen.

## Links

- Projekt: https://github.com/ctrwins/classic-watch-layout
- Support: https://github.com/ctrwins/classic-watch-layout/issues
- Datenschutz: https://github.com/ctrwins/classic-watch-layout/blob/main/docs/privacy.md
- Kontakt: ctrwins@googlemail.com
- [Dashboard-Anleitung mit allen Einträgen](store-setup.md)

## Vor der Einreichung ergänzen

- Kontaktadresse `ctrwins@googlemail.com` im Entwickler-Dashboard eintragen und gegebenenfalls verifizieren; sie ist bereits in der Datenschutzerklärung enthalten.
- Abschließende Verträglichkeitstests und Prüfung des Upload-Pakets.
- Etwaige noch offene Kontoverifizierung und 2FA-Anforderung im Dashboard prüfen. Entwicklerkonto und Registrierungsgebühr sind erledigt.

## Grafiken für das Listing

- Icon: `extension/icons/icon-128.png` (128×128, transparenter Rand).
- Screenshot: `assets/store/screenshot-1280x800.png` (1280×800, ohne Transparenz).
- Kleine Werbegrafik: `assets/store/promo-440x280.png` (440×280, ohne Transparenz).

Screenshot und Werbegrafik werden separat im Dashboard hochgeladen, nicht mit dem Erweiterungspaket. Details: [Store-Checkliste](store-release.md).

Die öffentliche Sichtbarkeit des Quellcodes ersetzt keine Lizenzentscheidung und keine Prüfung durch den Chrome Web Store.
