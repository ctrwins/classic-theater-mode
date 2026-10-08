# Tests und bekannte Einschränkungen

## Manueller Test

Nach der Installation in einem betroffenen Brave-/YouTube-Konto wurde per Nutzerrückmeldung bestätigt, dass die klassische Ansicht wiederhergestellt ist.

Das Ergebnis beruht auf dieser Rückmeldung, nicht auf einer unabhängigen Sichtprüfung oder pixelgenauen Messung. Es gilt für die getestete Kontovariante und lässt sich nicht auf alle YouTube-Rollouts übertragen.

## Automatisierte Prüfungen

- Node-Regressionssuite: späte Konfiguration, spätere Änderungen/Objektersatz, Alias-Pfade und Objektidentität, eingefrorene Objekte/eigene Getter, Serialisierung, Manifestumfang.
- Brave-Browsertest: Laden des MV3-Pakets vor dem Seitencode, MAIN-Welt unter CSP, Navigation innerhalb der Seite sowie kein Eingriff auf fremden Hosts oder m.youtube.com. Der Test verwendet lokale Testseiten mit synthetischen Konfigurationsdaten; er prüft keine angemeldeten Konten.
- Live-Diagnose ohne Anmeldung: klassischer Renderer und breite Player-DOM-Maße beobachtet. **Die Erkennung des Cookie-Dialogs ist unzuverlässig. Frühere `passed`-Ausgaben bestätigen daher keine vollständig geprüfte Darstellung.** Der aktuelle Status lautet `layout_metrics_only_visual_review_required`. Das Werkzeug gehört nicht zur regulären Testsuite. Das Ablehnen von Cookies muss ausdrücklich über `ALLOW_REJECT_CONSENT=1` aktiviert werden.

Vor einer Store-Veröffentlichung stehen weitere Verträglichkeitstests aus: andere Konten, Livechat, Playlists, Shorts-Navigation, Vollbild und das Zusammenspiel mit anderen Erweiterungen.

## Testumgebung

Die automatisierten Browserprüfungen verwenden temporäre Brave-Profile. Bestehende Profile und Kontoeinstellungen werden nicht verändert.
