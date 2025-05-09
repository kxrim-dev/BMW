# Überblick
In diesem Spiel fährt der Nutzer einen BMW. Ziel des Spiels ist es, ein Fahrzeug zu steuern und entgegenkommenden Autos auszuweichen. Die Herausforderung liegt in der Reaktionszeit des Spielers, ein Zusammenstoß führt zum Game Over. Zusätzlich gibt es ein Highscore-System , um die besten Ergebnisse zu speichern und anzuzeigen. Verbesserte Texturen sind auch noch für die nahe Zukunft geplant.

## Spielmechanik
Spielersteuerung
Der Spieler steuert ein Auto, das sich horizontal und vertikal auf eine Autobahn bewegen kann.

Steuerung erfolgt über WASD:

A: nach links fahren
D: nach rechts fahren
S: Bremsen
W: Beschleunigen
R: Nach dem verlieren neustarten

## Gegner-Spawning
Gegnerische Fahrzeuge spawnen regelmäßig am oberen Bildschirmrand.

Je länger der Spieler überlebt, werden die entgegenkommenden Autos Schneller.

## Kollisionsabfrage
Es werden präzise Hitboxen genutzt, um eine realistische Kollisionserkennung zu gewährleisten.

Sobald sich die Hitboxen des Spielerautos und eines gegnerischen Fahrzeugs überlappen, endet das Spiel.

## Highscore-System
Bei Spielende wird die erreichte Punktzahl (basierend auf der überlebten Zeit) berechnet.

Das Spiel speichert die Punktzahl über die User Datenbank.

Während dem Spielen des Spiels wird der aktuelle Highscore angezeigt.

Wenn der Spieler einen Durchlauf beendet, wird dieser Score automatisch aktualisiert.

## Verbesserte Texturen und Grafik
Fahrzeuge werden detaillierte, individuell gestaltete 2D-Sprites besitzen.

Die Straße wird über animierte Elemente verfügen wie:

Fahrbahnmarkierungen

Seitenbegrenzungen

Hintergrundanimationen (z. B. vorbeiziehende Landschaft)

Optional: Tag-Nacht-Wechsel oder Wettereinflüsse wie Regen oder Schnee zur Erhöhung der visuellen Abwechslung.

## Weitere Möglichen Features

### Startmenü mit:

"Start"-Button

Highscore-Anzeige

Sound On/Off Toggle

Pause-Funktion durch Druck auf die ESC-Taste

### Game-Over-Bildschirm mit:

Punktzahl

Highscore

"Erneut spielen"-Button

### Soundeffekte für:

Start

Kollision

Hintergrundmusik (optional)

### Erweiterungsideen
Power-Ups (z. B. temporäre Unverwundbarkeit, Punkte-Multiplikator)

Online-Highscore-Board

Fahrzeugauswahl / Skins

Multiplayer-Modus (lokal oder online, eher unwahrscheinlich weil das Spiel flüssig sein soll)








