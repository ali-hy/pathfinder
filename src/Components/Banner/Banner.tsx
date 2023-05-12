import { ALGORITHM } from "../../Types/algorithms/ALGORITHM";
import { PathfindingAlgorithm } from "../../Types/algorithms/PathfindingAlgorithm";
import "./Banner.scss";

interface BannerProps {
  algorithms: PathfindingAlgorithm[];
  selectAlgorithm: (algorithm:ALGORITHM) => void;
  children:any;
}

export default function Banner(props: BannerProps) {
  return (
    <div className="container-fluid p-3 banner bg-white position-fixed">
      <div className="d-flex align-items-center">
        <div className="banner-title pe-1 me-3 fw-bold">PATH-finder</div>
        <div className="me-3">
          <select name="" id="" onChange={({target: {value}}) => {
            const algorithm = Number.parseInt(value) as ALGORITHM;
            props.selectAlgorithm(algorithm);
          }}>
            {props.algorithms.map((algorithm) => <option key={algorithm.index} value={algorithm.index}>{algorithm.name}</option>)}
          </select>
        </div>
        <div className="col d-flex justify-content-between align-items-center">
          {props.children}
        </div>
      </div>
    </div>
  );
}
