require([

    "esri/config", "esri/Map", "esri/views/MapView", "esri/widgets/BasemapToggle", "esri/layers/FeatureLayer", "esri/PopupTemplate", "esri/widgets/Search", "esri/widgets/Legend", "esri/widgets/Expand", "esri/layers/GraphicsLayer", "esri/widgets/Sketch", "esri/widgets/Sketch/SketchViewModel"

], function (

    esriConfig, Map, MapView, BasemapToggle, FeatureLayer, PopupTemplate, Search, Legend, Expand, GraphicsLayer, Sketch, SketchViewModel

) {
    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurDbsYHINrVfeJUjyYqMCmBOCZynWcbmvlXsqFB-_AO4nxatgmMVtezmyarfJEpojgXuH45aZPFR0yShlgGdqejBQA0N0CnpAmPLHXFYweDNNED7uKlPktvTkbi2wLR4NfekPG9mc0ANV8qJyisS08y0Wt9H4Y0Keo4sSb8r7NZU0-M5smVAtHEVaaJVVXsts1Nv7OuU3Pv-xd_pN7G5GsBw.AT1_Dup3ajUs";

    const map = new Map({
        basemap: "arcgis-topographic" // Basemap layer service
    });

    const view = new MapView({
        map: map,
        center: [-7.62, 33.59], // Longitude, latitude
        zoom: 13, // Zoom level
        container: "viewDiv", // Div element
        popup: {
            dockEnabled: false, // Désactive l'ancrage automatique
            autoOpenEnabled: true, // Permet l'ouverture automatique
            collapseEnabled: true, // Permet de réduire le popup
            highlightEnabled: true // Met en surbrillance la feature sélectionnée
        }
    });

    const basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "arcgis-imagery"
    });
    view.ui.add(basemapToggle, "bottom-left");

    //Search localisation bar
    const searchWidget = new Search({
        view: view
    });
    view.ui.add(searchWidget, { // Adds the search widget below other elements in the top left corner of the view
        position: "top-left",
        index: 2
    });

    //Couche communes et popup
    var popupCommune = new PopupTemplate({
        title: "<b>Commune: {COMMUNE_AR}</b>",
        content: "<p> PREFECTURE : {PREFECTURE} </p>" + "<p> COMMUNE : {COMMUNE_AR}  </p> " + "<p> Shape_Leng : {Shape_Leng} </p> " + "<p> Shape_Le_1 : {Shape_Le_1} </p> " + "<p> Shape_Area : {Shape_Area} </p> " + "<p> numéro : {numero} </p> " + "<p> PLAN D'AMENAGEMENT : {PLAN_AMENA} </p> ",
    });
    const communes = new FeatureLayer({
        url: "https://services5.arcgis.com/TbprQ2JL7Oe3pK0F/arcgis/rest/services/Projet_Elaboration_d’un_Géoportail/FeatureServer/5",
        outFields: ["PREFECTURE", "COMMUNE_AR", "Shape_Leng", "Shape_Le_1", "Shape_Area", "numero", "PLAN_AMENA"],
        popupTemplate: popupCommune
    });
    map.add(communes);

    //Couche Voirie et popup 
    var popupVoirie = new PopupTemplate({
        title: "Voirie de Casablanca",
        content: [{
            type: "fields",
            fieldInfos: [
                {
                    "fieldName": "NOM", "label": "", "isEditable": true, "tooltip": "", "visible": true, "format": null, "stringFieldOption": "text-box"
                },
                {
                    "fieldName": "LENGTH", "label": "Longueur", "isEditable": true, "tooltip": "", "visible": true, "format": { "places": 1, "digitSeparator": true }, "stringFieldOption": "text-box"
                },
            ]
        }]
    });
    const voirie = new FeatureLayer({
        url: "https://services5.arcgis.com/TbprQ2JL7Oe3pK0F/arcgis/rest/services/Projet_Elaboration_d’un_Géoportail/FeatureServer/4",
        outFields: ["NOM", "LENGTH"],
        popupTemplate: popupVoirie
    });
    map.add(voirie);

    //Couche Population et Popup charts 
    var popupPopulation = new PopupTemplate({
        title: "<b>Population de l'Arrondissement : {ARRONDISSE}</b>",
        content: [
            {
                type: "fields",
                fieldInfos: [
                    { fieldName: "TOTAL1994", label: "Population 1994", format: { digitSeparator: true, places: 0 } },
                    { fieldName: "TOTAL2004", label: "Population 2004", format: { digitSeparator: true, places: 0 } },
                    { fieldName: "evolution_", label: "Évolution", format: { digitSeparator: true, places: 0 } }
                ]
            },
            {
                type: "media",
                mediaInfos: [
                    {
                        type: "bar-chart",
                        caption: "Évolution de la population entre 1994 et 2004",
                        value: {
                            fields: ["TOTAL1994", "TOTAL2004"],
                            tooltipField: "ARRONDISSE"
                        }
                    },
                    {
                        type: "bar-chart",
                        caption: "Variation nette de la population",
                        value: {
                            fields: ["evolution_"],
                            normalizeField: null,
                            tooltipField: "ARRONDISSE"
                        }
                    }
                ]
            }
        ]
    });

    const casaPop = new FeatureLayer({
        url: "https://services5.arcgis.com/TbprQ2JL7Oe3pK0F/arcgis/rest/services/Projet_Elaboration_d’un_Géoportail/FeatureServer/0",
        outFields: ["PREFECTURE", "ARRONDISSE", "Shape_Leng", "Shape_Area", "MAROCAINS", "ETRANGERS", "TOTAL1994", "MÉNAGES199", "MAROCAIN_1", "ETRANGER_1", "TOTAL2004", "MÉNAGES200", "TAUX", "densite199", "densite200", "evolution_"],
        popupTemplate: popupPopulation

    });
    map.add(casaPop);

    //Grandes surfaces et popup
    var popupGrandeSurface = new PopupTemplate({
        title: "<b>Grandes Surfaces: {Grande surface wgs}</b>",
        content: "<p> Type : {Type} </p>" + "<p> Adresse : {Adresse}  </p> "
    });
    const grandeSurface = new FeatureLayer({
        url: "https://services5.arcgis.com/TbprQ2JL7Oe3pK0F/arcgis/rest/services/Projet_Elaboration_d’un_Géoportail/FeatureServer/1",
        outFields: ["Type", "Adresse"],
        popupTemplate: popupGrandeSurface
    });
    map.add(grandeSurface);

    //Couche Hotels et popup
    var popupHotels = new PopupTemplate({
        title: "<b>Hotels : {Hotels wgs}</b>",
        content: "<p> HOTEL : {HOTEL} </p>" + "<p> CATÉGORIE : {CATÉGORIE}  </p> " + "<p> ADRESSE : {ADRESSE} </p>" + "<p> PHONE_1 : {PHONE1}  </p> " + "<p> PHONE_2 : {PHONE_2} </p>" + "<p> CAPACITE DES CHAMBRES : {CAP_CHAMBR}  </p> " + "<p> CAPACITES DE LITS : {CAP_LIT} </p>" + "<p> Etoile : {Etoile}  </p> " + "<p> cap_reunio : {cap_reunio}  </p> "
    });
    const hotels = new FeatureLayer({
        url: "https://services5.arcgis.com/TbprQ2JL7Oe3pK0F/arcgis/rest/services/Projet_Elaboration_d’un_Géoportail/FeatureServer/2",
        outFields: ["Type", "CATÉGORIE", "ADRESSE", "PHONE1", "PHONE_2", "CAP_CHAMBR", "CAP_LIT", "Etoile", "cap_reunio"],
        popupTemplate: popupHotels
    });
    map.add(hotels);

    //Reclamations
    var popupReclamation = new PopupTemplate({
        title: "<b>Reclamation  : {Reclamation wgs}</b>",
        content: "<p> Objet : {Objet} </p>" + "<p> Message : {Message}  </p> " + "<p> Démarche : {Demarche_d} </p>" + "<p> Mail : {Mail}  </p> "
    });
    const reclamation = new FeatureLayer({
        url: "https://services5.arcgis.com/TbprQ2JL7Oe3pK0F/arcgis/rest/services/Projet_Elaboration_d’un_Géoportail/FeatureServer/3",
        outFields: ["Objet", "Message", "Demarche_d", "Mail"],
        popupTemplate: popupReclamation
    });
    map.add(reclamation);

    // Création de la légende et du widget Expand
    const legend = new Legend({
        view: view,
        layerInfos: [
            { layer: communes, title: "Communes" },
            { layer: voirie, title: "Voirie" },
            { layer: casaPop, title: "Population" },
            { layer: grandeSurface, title: "Grandes Surfaces" },
            { layer: hotels, title: "Hôtels" },
            { layer: reclamation, title: "Réclamations" }
        ]
    });
    const legendExpand = new Expand({
        view: view,
        content: legend,  // La légende est placée dans ce widget
        expandIconClass: "esri-icon-layer-list",  // Icône pour le bouton
        expandTooltip: "Afficher la légende" // Tooltip au survol
    });
    view.ui.add(legendExpand, "bottom-right");  // Ajout du widget Expand à l'interface utilisateur


    // Outils d'édition pour ajouter des réclamations
    const sketchViewModel = new SketchViewModel({
        view: view,
        layer: new GraphicsLayer()
    });

    const sketchWidget = new Sketch({
        view: view,
        layer: new GraphicsLayer(),
        creationMode: "update"
    });

    view.ui.add(sketchWidget, "bottom-left" , 2 );

    // Fonction pour ajouter une réclamation
    document.getElementById("addReclamation").addEventListener("click", function() {
        const objet = document.getElementById("Objet").value;
        const message = document.getElementById("Message").value;
        const mail = document.getElementById("Mail").value;

        if (objet && message && mail) {
            const point = view.center;

            const newReclamation = {
                attributes: {
                    Objet: objet,
                    Message: message,
                    Demarche_d: "Nouveau", // Vous pouvez ajuster selon les valeurs
                    Mail: mail
                },
                geometry: point
            };

            reclamation.applyEdits({
                addFeatures: [newReclamation]
            }).then(() => {
                alert("Réclamation ajoutée avec succès !");
            }).catch((error) => {
                console.error("Erreur lors de l'ajout de la réclamation", error);
            });
        } else {
            alert("Veuillez remplir tous les champs.");
        }
    });

    // Fonction pour filtrer les réclamations selon un objet spécifique
    document.getElementById("filterSelect").addEventListener("change", function(event) {
        const selectedCommune = event.target.value;
        reclamation.definitionExpression = selectedCommune ? `COMMUNE_AR = '${selectedCommune}'` : "";
    });

    // Réinitialiser les filtres
    document.getElementById("resetFilters").addEventListener("click", function() {
        reclamation.definitionExpression = "";
        view.goTo({ center: [-7.62, 33.59], zoom: 13 });
    });
    // Fonction de requête spatiale
    function queryFeaturelayer(geometry) {
        const communeQuery = {
            spatialRelationship: "intersects",
            geometry: geometry,
            outFields: ["PREFECTURE", "COMMUNE_AR", "Shape_Leng", "Shape_Le_1", "Shape_Area"],
            returnGeometry: true
        };

        communes.queryFeatures(communeQuery)
            .then((results) => {
                console.log("Feature count: " + results.features.length);
            })
            .catch((error) => {
                console.error("Erreur lors de la requête :", error);
            });
    }
    // Gestion des filtres
    document.getElementById("toggleFilters").addEventListener("click", function () {
        const panel = document.getElementById("filtersPanel");
        panel.classList.toggle("visible");
        this.textContent = panel.classList.contains("visible") ? "× Fermer" : "☰ Filtres";
    });

    document.getElementById("resetFilters").addEventListener("click", function () {
        // Réinitialiser les sélections
        document.getElementById("filterSelect").value = "";
        document.getElementById("hotelFilter").value = "";
        document.getElementById("surfaceFilter").value = "";
        document.getElementById("populationFilter").value = "";


        // Réinitialiser les couches
        communes.definitionExpression = "";
        hotels.definitionExpression = "";
        grandeSurface.definitionExpression = "";
        casaPop.definitionExpression = "";

        // Recentrer la vue
        view.goTo({
            center: [-7.62, 33.59],
            zoom: 11
        });
    });

    // Filtre pour les communes
    document.getElementById("filterSelect").addEventListener("change", function (event) {
        communes.definitionExpression = event.target.value;
    });

    // Filtre pour les hôtels
    document.getElementById("hotelFilter").addEventListener("change", function (event) {
        hotels.definitionExpression = event.target.value;
    });

    // Filtre pour les grandes surfaces
    document.getElementById("surfaceFilter").addEventListener("change", function (event) {
        grandeSurface.definitionExpression = event.target.value;
    });

    // Filtre pour les population
    document.getElementById("populationFilter").addEventListener("change", function (event) {
        casaPop.definitionExpression = event.target.value;
    });


});