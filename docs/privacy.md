# Datenschutzerklärung – Classic Watch Layout

**Stand: 07.10.2026 · Entwurf**

## Kurzfassung

Classic Watch Layout korrigiert ausgewählte YouTube-Layoutflags lokal, damit die klassische Watch-Layout-/Theater-Auswahl wieder verwendet werden kann. Die Erweiterung verarbeitet keine Kontodaten und sendet keine Daten an den Entwickler oder an Dritte.

## Welche Daten werden verarbeitet?

- **Keine Erhebung:** keine Namen, E-Mail-Adressen, Kennungen, IP-Adressen, URLs als Nutzungsprotokoll, Such-/Wiedergabeverläufe oder sonstigen personenbezogenen Daten.
- **Keine Cookies oder Speicherprofile:** Die Erweiterung liest oder schreibt keine Cookies und speichert keine Nutzungsdaten.
- **Lokale Seitenänderung:** Das Content Script läuft ausschließlich auf passenden `https://www.youtube.com/*`-Seiten und ändert dort die für das Layout relevanten JavaScript-Konfigurationswerte im Seitenkontext. Diese Änderung ist eine lokale Laufzeitaktion; daraus wird kein Datensatz erstellt oder übertragen.
- **Keine Übermittlung:** keine Analytics, kein Tracking, keine Werbung, keine externen Requests und keine Weitergabe an Dritte.

## Berechtigungen und Reichweite

Der YouTube-Hostzugriff ist erforderlich, damit der Browser das Content Script auf YouTube bei `document_start` ausführen kann. Die Erweiterung benötigt keine weiteren API-Berechtigungen und hat kein Popup.

## Code und Sicherheit

Der gesamte ausführbare Code liegt im Erweiterungspaket. Es werden keine Remote-Skripte, Remote-Imports oder nachgeladenen ausführbaren Inhalte verwendet. Das Script läuft in der MV3-`MAIN`-Welt, um die Seitenkonfiguration zu ändern; es liest keine Login- oder Kontodaten. Bei Änderungen am Datenfluss wird diese Erklärung entsprechend aktualisiert.

## Aufbewahrung, Löschung, Kontakt

Da keine Nutzerdaten erhoben oder gespeichert werden, gibt es keine serverseitige Aufbewahrungsfrist und keinen Löschvorgang. Vor der Store-Einreichung muss eine verantwortliche Kontaktadresse ergänzt werden.

Öffentliche URL dieses Entwurfs: https://github.com/ctrwins/classic-watch-layout/blob/main/docs/privacy.md

## Chrome-Web-Store-Angaben

Die Angaben im Entwickler-Dashboard müssen mit dem veröffentlichten Paket übereinstimmen. Dazu gehören Zweck, Berechtigungen und Datennutzung. Quellen: [Privacy practices](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy) und [User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq).

## English summary

Classic Watch Layout locally adjusts selected YouTube layout flags to restore the classic watch/theater layout. It does **not** collect, store, sell, or share personal data; it does not read or write cookies; it has no analytics, tracking, advertising, remote scripts, or external network requests. The only required site access is `https://www.youtube.com/*`, used to run the MV3 content script at document start. The script changes layout configuration locally and does not transmit page, account, or viewing data. This draft is available at the public URL above. A responsible contact address is still required before store submission.
