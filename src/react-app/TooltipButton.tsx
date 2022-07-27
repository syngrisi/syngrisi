import * as bootstrap from '../../node_modules/bootstrap';
import {useEffect} from "react";

// console.log(document.getElementById('tooltip'))
// new bootstrap.Tooltip(document.getElementById('tooltip'));

export default function TooltipButton() {
    useEffect(() => {
        // console.log(111111);
        // new bootstrap.Tooltip(document.getElementById('tooltip'));
    }, []);
    return (
            <div>
                <button
                        className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="bottom"
                        data-bs-html="true"
                        id="tooltip"
                        title="Tooltip">
                    Test Tooltip and Style
                </button>
            </div>
    );
}
