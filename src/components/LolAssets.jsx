import React from "react";
import {useVersion} from "./version";

function ChampionImage(props) {
    const {championId, ...imgprops} = props;

    const version = useVersion();

    return (
        <img className={"championImage"} src={"/api/static/" + version + "/champion/image/" + championId} {...imgprops}
             alt={"champion-image-" + championId}/>
    );
}

function SummonerSpellImage(props) {
    const {spellId, ...imgprops} = props;

    const version = useVersion();

    return (
        <img className={"summonerSpellImage"}
             src={"/api/static/" + version + "/summonerSpell/image/" + spellId} {...imgprops}
             alt={"summoner-spell-image-" + spellId}/>
    );
}

function ItemImage(props) {
    const {itemId, ...imgprops} = props;

    const version = useVersion();

    if (itemId) {
        return (
            <img className={"itemImage"} src={"/api/static/" + version + "/item/image/" + itemId} {...imgprops}
                 alt={"item-image-" + itemId}/>
        );
    } else {
        return (
            <div className={"d-inline-block itemImage item-empty align-middle"}/>
        );
    }
}

export {ChampionImage, SummonerSpellImage, ItemImage};