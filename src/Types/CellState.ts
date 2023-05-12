export enum CELLSTATE{
    //Travel Valid
    empty,
    debugging,
    target, //last travel Valid

    //Not Travil Valid
    searchStart,
    wall,
    path,
    visited,
}