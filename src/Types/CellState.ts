export enum CELLSTATE{
    //Travel Valid
    empty,
    debugging,
    target, //last travel Valid

    //Not Travel Valid
    searchStart,
    wall,
    path,
    visited,
}