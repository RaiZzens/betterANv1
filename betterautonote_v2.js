var ScriptData={name:"Auto notes from report",version:"v2.2",lastUpdate:"2025-12-16",author:"xdam98",authorContact:"Xico#7941 (Discord)"},LS_prefix="xd",translations={
    pt_PT:{unknown:"Desconhecido",verifyReportPage:"O Script deve ser utilizado dentro de um relatório",offensive:"Ofensiva",defensive:"Defensiva",probOffensive:"Provavelmente Ofensiva",probDefensive:"Provavelmente Defensiva",noSurvivors:"Nenhuma tropa sobreviveu",watchtower:"Torre",wall:"Muralha",firstChurch:"Igreja Principal",church:"Igreja",defensiveNukes:"fulls defesa",noteCreated:"Nota criada",addReportTo:"Colocar relatório no:"},
    en_DK:{unknown:"Unknown",verifyReportPage:"This script can only be run on a report screen.",offensive:"Offensive",defensive:"Defensive",probOffensive:"Probably Offensive",probDefensive:"Probably Defensive",noSurvivors:"No troops survived",watchtower:"Watchtower",wall:"Wall",firstChurch:"First church",church:"Church",defensiveNukes:"defensive nukes",noteCreated:"Note created",addReportTo:"Add report to which village:"},
    en_US:{unknown:"Unknown",verifyReportPage:"This script can only be run on a report screen.",offensive:"Offensive",defensive:"Defensive",probOffensive:"Probably Offensive",probDefensive:"Probably Defensive",noSurvivors:"No troops survived",watchtower:"Watchtower",wall:"Wall",firstChurch:"First church",church:"Church",defensiveNukes:"defensive nukes",noteCreated:"Note created",addReportTo:"Add report to which village:"},
    ro_RO:{unknown:"Unknown",verifyReportPage:"This script can only be run on a report screen.",offensive:"Offensive",defensive:"Defensive",probOffensive:"Probably Offensive",probDefensive:"Probably Defensive",noSurvivors:"No troops survived",watchtower:"Watchtower",wall:"Wall",firstChurch:"First church",church:"Church",defensiveNukes:"defensive nukes",noteCreated:"Note created",addReportTo:"Add report to which village:"},
    pl_PL:{
        unknown:"Unbekannt",
        verifyReportPage:"Dieses Script kann nur auf einem Bericht-Bildschirm ausgeführt werden.",
        offensive:"Offensiv",
        defensive:"Defensiv",
        probOffensive:"Wahrscheinlich Offensiv",
        probDefensive:"Wahrscheinlich Defensiv",
        noSurvivors:"Keine Truppen überlebt",
        watchtower:"Wachturm",
        wall:"Mauer",
        firstChurch:"Hauptkirche",
        church:"Kirche",
        defensiveNukes:"Verteidigungsanlagen",
        noteCreated:"Notiz erstellt",
        addReportTo:"Bericht hinzufügen zu welchem Dorf:"
    }
},_t=a=>null!=translations[game_data.locale]?translations[game_data.locale][a]:translations.pt_PT[a],initTranslations=()=>localStorage.getItem(`${LS_prefix}_langWarning`)?1:(void 0===translations[game_data.locale]&&UI.ErrorMessage(`No translation found for <b>${game_data.locale}</b>.`,3e3),localStorage.setItem(`${LS_prefix}_langWarning`,1),0);

CriarRelatorioNotas={
    dados:{player:{nomePlayer:game_data.player.name,playerEstaAtacar:!1,playerEstaDefender:!1,playerQuerInfoAtacante:!1,playerQuerInfoDefensor:!1},aldeia:{ofensiva:{idAldeia:"-1",tipoAldeia:_t("unknown"),tropas:{totais:[],ofensivas:0,defensivas:0}},defensiva:{idAldeia:"-1",tipoAldeia:_t("unknown"),tropas:{visiveis:!1,totais:[],fora:{visiveis:!1,ofensivas:0,defensivas:0,totais:[]},dentro:{ofensivas:0,defensivas:0,totais:[]},apoios:0},edificios:{edificiosVisiveis:!1,torre:[!1,0],igrejaPrincipal:[!1,0],igreja:[!1,0],muralha:[!1,0]}}},mundo:{fazendaPorTropa:[],arqueirosAtivos:!1}},
    configs:{esconderTropas:!1},
    verificarPagina:function(){var a=window.location.href.match(/(screen\=report){1}|(view\=){1}\w+/g);return!(!a||2!=a.length)||(UI.ErrorMessage(_t("verifyReportPage"),5e3),!1)},
    initConfigs:function(){this.configs.esconderTropas=this.loadLSConfig("esconderTropas",!1)},
    loadLSConfig:(a,e)=>localStorage.getItem(`${LS_prefix}_${a}`)??e,
    initDadosScript:function(){/*... unverändert ...*/},
    getTipoAldeia:function(){/*... unverändert ...*/},
    geraTextoNota:function(){/*... unverändert ...*/},

    escreveNota:function(){
        var i=this;
        var s=this.dados.player.playerEstaAtacar||this.dados.player.playerQuerInfoDefensor ? parseInt(this.dados.aldeia.defensiva.idAldeia) : parseInt(this.dados.aldeia.ofensiva.idAldeia);
        var e="0"==game_data.player.sitter ?
            "https://"+location.hostname+"/game.php?village="+game_data.village.id+"&screen=api&ajaxaction=village_note_edit&h="+game_data.csrf+"&client_time="+Math.round(Timing.getCurrentServerTime()/1e3) :
            "https://"+location.hostname+"/game.php?village="+game_data.village.id+"&screen=api&ajaxaction=village_note_edit&t="+game_data.player.id;
        var a="";

        if(this.dados.player.playerEstaAtacar||this.dados.player.playerEstaDefender){
            a=i.geraTextoNota();
            $.post(e,{note:a,village_id:s,h:game_data.csrf},function(a){
                UI.SuccessMessage(_t("noteCreated"),2e3)
            });
        } else {
            var t=$('<div class="center"> '+_t("addReportTo")+" </div>");
            var d=$('<div class="center"><button class="btn btn-confirm-yes atk">'+_("Atacante")+'</button><button class="btn btn-confirm-yes def">'+_("Defensor")+"</button></div>");
            var o=t.add(d);
            Dialog.show("relatorio_notas",o);

            d.find("button.atk").click(function(){
                i.dados.player.playerQuerInfoAtacante=!0;
                a=i.geraTextoNota();
                $.post(e,{note:a,village_id:i.dados.aldeia.ofensiva.idAldeia,h:game_data.csrf},function(resp){
                    UI.SuccessMessage(_t("noteCreated"),2e3);
                });
                Dialog.close();
            });

            d.find("button.def").click(function(){
                i.dados.player.playerQuerInfoDefensor=!0;
                a=i.geraTextoNota();
                $.post(e,{note:a,village_id:i.dados.aldeia.defensiva.idAldeia,h:game_data.csrf},function(resp){
                    UI.SuccessMessage(_t("noteCreated"),2e3);
                });
                Dialog.close();
            });
        }
    },

    start:function(){this.verificarPagina()&&(this.initDadosScript(),this.getTipoAldeia(),this.escreveNota())}
};

initTranslations()?CriarRelatorioNotas.start():setTimeout(()=>{CriarRelatorioNotas.start();},3000);
$.getJSON("https://api.countapi.xyz/hit/xdamScripts/scriptCriarNotaRelatorio");
