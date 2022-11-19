import { CellState } from "../Types/CellState";

interface BannerProps{
    
}

export default function Banner(props:BannerProps){
    return(
        <div className="container-fluid p-3 banner bg-white position-fixed">
            <div className="row">
                <div className="col-1 title fw-bold ">PATH-finder</div>
                <div className="col-2"><select name="" id="">
                    <option value={0}>pathfinder-1</option>    
                </select></div>
                <div className="col d-flex">
                    
                </div>
            </div>
        </div>
    )
}