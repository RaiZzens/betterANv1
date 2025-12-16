var ScriptData={name:"Auto notes from report",version:"v2.2",lastUpdate:"2025-12-16",author:"xdam98",authorContact:"Xico#7941 (Discord)"},LS_prefix="xd",translations={/*...deine Übersetzungen unverändert...*/},_t=a=>null!=translations[game_data.locale]?translations[game_data.locale][a]:translations.pt_PT[a],initTranslations=()=>localStorage.getItem(`${LS_prefix}_langWarning`)?1:(void 0===translations[game_data.locale]&&UI.ErrorMessage(`No translation found for <b>${game_data.locale}</b>.`,3e3),localStorage.setItem(`${LS_prefix}_langWarning`,1),0);

CriarRelatorioNotas={
    dados:{/*... unverändert ...*/},
    configs:{esconderTropas:!1},
    verificarPagina:function(){/*... unverändert ...*/},
    initConfigs:function(){this.configs.esconderTropas=this.loadLSConfig("esconderTropas",!1)},
    loadLSConfig:(a,e)=>localStorage.getItem(`${LS_prefix}_${a}`)??e,
    initDadosScript:function(){/*... unverändert ...*/},
    getTipoAldeia:function(){/*... unverändert ...*/},
    geraTextoNota:function(){/*... unverändert ...*/},

    // Hier die neue Funktion, die Notiz anhängt statt überschreibt
    escreveNota:function(){
        var i=this;
        var s=this.dados.player.playerEstaAtacar||this.dados.player.playerQuerInfoDefensor ? parseInt(this.dados.aldeia.defensiva.idAldeia) : parseInt(this.dados.aldeia.ofensiva.idAldeia);
        var e="0"==game_data.player.sitter ?
            "https://"+location.hostname+"/game.php?village="+game_data.village.id+"&screen=api&ajaxaction=village_note_edit&h="+game_data.csrf+"&client_time="+Math.round(Timing.getCurrentServerTime()/1e3) :
            "https://"+location.hostname+"/game.php?village="+game_data.village.id+"&screen=api&ajaxaction=village_note_edit&t="+game_data.player.id;
        var a="";

        if(this.dados.player.playerEstaAtacar||this.dados.player.playerEstaDefender){
            a=i.geraTextoNota();

            // Alte Notiz holen und neue anhängen
            $.getJSON("https://"+location.hostname+"/game.php?village="+s+"&screen=api&ajaxaction=village_note", function(data){
                var alteNotiz = data.note || "";
                var neueNotiz = alteNotiz + "\n\n" + a; // Anhängen
                $.post(e, {note: neueNotiz, village_id: s, h: game_data.csrf}, function(resp){
                    UI.SuccessMessage(_t("noteCreated"), 2000);
                });
            });
        } else {
            var t=$('<div class="center"> '+_t("addReportTo")+" </div>");
            var d=$('<div class="center"><button class="btn btn-confirm-yes atk">'+_("Atacante")+'</button><button class="btn btn-confirm-yes def">'+_("Defensor")+"</button></div>");
            var o=t.add(d);
            Dialog.show("relatorio_notas",o);

            d.find("button.atk").click(function(){
                i.dados.player.playerQuerInfoAtacante=!0;
                a=i.geraTextoNota();
                $.getJSON("https://"+location.hostname+"/game.php?village="+i.dados.aldeia.ofensiva.idAldeia+"&screen=api&ajaxaction=village_note", function(data){
                    var alteNotiz = data.note || "";
                    var neueNotiz = alteNotiz + "\n\n" + a;
                    $.post(e, {note: neueNotiz, village_id: i.dados.aldeia.ofensiva.idAldeia, h: game_data.csrf}, function(resp){
                        UI.SuccessMessage(_t("noteCreated"), 2000);
                    });
                });
                Dialog.close();
            });

            d.find("button.def").click(function(){
                i.dados.player.playerQuerInfoDefensor=!0;
                a=i.geraTextoNota();
                $.getJSON("https://"+location.hostname+"/game.php?village="+i.dados.aldeia.defensiva.idAldeia+"&screen=api&ajaxaction=village_note", function(data){
                    var alteNotiz = data.note || "";
                    var neueNotiz = alteNotiz + "\n\n" + a;
                    $.post(e, {note: neueNotiz, village_id: i.dados.aldeia.defensiva.idAldeia, h: game_data.csrf}, function(resp){
                        UI.SuccessMessage(_t("noteCreated"), 2000);
                    });
                });
                Dialog.close();
            });
        }
    },

    start:function(){this.verificarPagina()&&(this.initDadosScript(),this.getTipoAldeia(),this.escreveNota())}
};

initTranslations()?CriarRelatorioNotas.start():setTimeout(()=>{CriarRelatorioNotas.start();},3000);
$.getJSON("https://api.countapi.xyz/hit/xdamScripts/scriptCriarNotaRelatorio");
