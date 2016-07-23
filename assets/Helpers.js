/*global jQuery, tasteGedrueckt */

/**
 * Ein Helper, um ein Bild zu laden
 *
 * @param  {string} src    Relativer Bildpfad
 * @param  {int}    zIndex Höhe des Bildes (CSS z-index)
 *
 * @return {object}
 */
function ladeBild(src, zIndex) {
    "use strict";

    var img = jQuery("<img>");
    img.attr("src", src);
    img.css({
        position: "absolute",
        left: "1",
        top: "1",
        "z-index": zIndex,
    });

    img.bind("load", function() {
        jQuery("body").append(this);
    });

    return img;
}

(function ($) {
    "use strict";

    /**
     * Auto Klasse
     */
    $.Auto = function (image) {
        this.loadImage(image);
    };

    $.Auto.prototype = {
        loadImage: function(image) {
            this.car = ladeBild(image, 5);
        },
        rotation: 0,
        setLinks: function(abstandLinks) {
            this.car.css("left", abstandLinks);
        },
        setOben: function(abstandOben) {
            this.car.css("top", abstandOben);
        },
        getLinks: function() {
            return parseInt(this.car.css("left"));
        },
        getOben: function() {
            return parseInt(this.car.css("top"));
        },
        steuernLinks: function(gradDregung) {
            this.kurve(gradDregung * -1);
        },
        steuernRechts: function(gradDregung) {
            this.kurve(gradDregung);
        },
        kurve: function(gradDrehung) {
            // Aktuelle Drehung speichern
            this.rotation = Math.floor(this.rotation + gradDrehung);

            // Ringsherum ermöglichen
            if (this.rotation >= 360) {
                this.rotation -= 360;
            } else if (this.rotation < 0) {
                this.rotation += 360;
            }

            // Drehen
            this.car.css({
                transform: "rotate(" + this.rotation + "deg)"
            });
        },
        fahre: function(geschwindigkeit) {
            var leftSpeed = 0,
                downSpeed = 0,
                maxSpeed  = 90 / geschwindigkeit;

            // Beweung setzen
            if (this.rotation <= 90) {
                leftSpeed = (90 - this.rotation) / maxSpeed;
                downSpeed = this.rotation / maxSpeed;
            } else if (this.rotation <= 180) {
                downSpeed = (180 - this.rotation) / maxSpeed;
                leftSpeed = (this.rotation - 90) / maxSpeed * -1;
            } else if (this.rotation <= 270) {
                leftSpeed = (270 - this.rotation) / maxSpeed * -1;
                downSpeed = (this.rotation - 180) / maxSpeed * -1;
            } else if (this.rotation <= 360) {
                downSpeed = (360 - this.rotation) / maxSpeed * -1;
                leftSpeed = (this.rotation - 270) / maxSpeed;
            }

            // Auto bewegen
            this.setLinks(this.getLinks() + leftSpeed);
            this.setOben(this.getOben() + downSpeed);
        }
    };

    var driveKeysPressed = {};

    $(document).bind("keydown", function(e) {
        // gedrückte Taste setzen
        var tasteKey = e.keyCode || e.which;

        // Pfeil gedrückt -> Keine Reaktion
        if (tasteKey >= 37 && tasteKey <= 40) {
            e.preventDefault();
            return;
        }

        // Kein Buchstabe gedrückt
        if (tasteKey < 65 || tasteKey > 90) {
            return;
        }

        driveKeysPressed[tasteKey] = true;
    });

    $(document).bind("keyup", function (e) {
        delete driveKeysPressed[e.which];
    });

    function handleKeyPressed() {
        // abbrechen wenn die Funktion tasteGedrueckt nicht definiert ist
        if ("undefined" === typeof tasteGedrueckt) {
            return;
        }

        for (var key in driveKeysPressed) {
            var taste = String.fromCharCode(key);
            tasteGedrueckt(taste.toLowerCase());
        }
    }

    setInterval(handleKeyPressed, 25);

}(jQuery));
