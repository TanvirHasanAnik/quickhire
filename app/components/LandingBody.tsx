import CategoryExplore from "./body-components/CategoryExplore"
import LatestJobList from "./body-components/LatestJobList"

export default function LandingBody(){
    return (
        <div>
            <div>Sponsors</div>
            <CategoryExplore/>
            <div>Joining Advertisement</div>
            <LatestJobList/>
        </div>
    )
}