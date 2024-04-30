import React,{useState} from "react";
import { UncontrolledCollapse } from "reactstrap";

const MoleculeInfo = (props) => {
    const events = ['click'];
    const [openedQuestion , setOpenedQuestion] = useState('')
    const [currentlyopened , setCurrentlyOpened] = useState(false)


    const data = [
        {
          "What is this medicine for": "This medication is an analogue of vitamin D, prescribed for hypocalcaemia, hypoparathyroidism, hypophosphataemia, renal osteodystrophy, and osteomalacia. Since it does not require any activation process by kidneys like other vitamin D supplements, more useful for people who have kidney problems.",
          "How does it work": "It works by helping the body to use more of the calcium found in foods and supplements.",
          "How should this medicine be used": "It comes as a capsule to take by mouth, with food. It also comes as a solution for injection to be administered by a healthcare provider into the vein.",
          "Common side effects of this medicine": "Dry mouth, muscle pain, increased thirst, loss of appetite, vomiting, metallic taste, upset stomach, constipation, difficult urination.",
          "What do I do if I miss a dose": "Take a missed dose as soon as you think about it.  If it is close to the time for your next dose, skip the missed dose and go back to your normal time.  Do not take 2 doses at the same time or extra doses.  Do not change the dose or stop this drug. Talk with the doctor.",
          "What precautions should I take when taking this medicine": "Tell your doctor if you are allergic to any drugs. Some drugs like phenytoin, phenobarbital, prednisone and some laxatives may affect the availability. Inform your doctor if you have kidney or liver disease, pregnant, or planning to have surgery including dental procedures.",
          "When do I need to seek medical help": "Seek help if you have signs of a very bad reaction to the drug. These include wheezing; chest tightness; fever; itching; bad cough; blue or gray skin color; seizures; or swelling of face, lips, tongue, or throat. Inform doctor if you experience any bruising or bleeding, any rash, or if any side effect or health problem is not better or you are feeling worse.",
          "Can I take it with other medicines": "This drug will only work if you get the right amount of calcium from your diet. If you are being treated with dialysis, your doctor may also prescribe a low phosphate diet. Follow these directions carefully. If you do not have kidney disease, you should drink plenty of fluids when taking this drug. If you have kidney disease, talk to your doctor about how much fluid you should drink each day.",
          "Are there any food restrictions": "Avoid alcohol and grapefruit juice.",
          "How do I store this medicine": "Store in a cool, dry place away from the reach of children. - Medicines must not be used past the expiry date.",
          "Pregnancy Category": "Category C : Animal reproduction studies have shown an adverse effect on the fetus and there are no adequate and well-controlled studies in humans, but potential benefits may warrant use of the drug in pregnant women despite potential risks.",
          "Therapeutic Classification": "Vitamins",
          "moleculeName_s": "cholecalciferol"
        }
      ]

    const handleOpen = (index) =>{
        if(!currentlyopened) {
            setOpenedQuestion('molecule'+index)
            setCurrentlyOpened(true)
        } else {
            setCurrentlyOpened(false)
            setOpenedQuestion('')
        }
    }

    return (
        <React.Fragment>
            {Object.keys(data[0]).map((key,index) => {
                return (
                    <React.Fragment>
                        <section className="border mb-3 rounded ">
                            <p className="mb-0 p-2 d-flex align-items-center justify-content-between question-hover" onClick={(e) => {handleOpen(index)}} id={'molecule' + index} title="Click to open answer">
                                {key}
                                <span>
                                    <svg className={ openedQuestion==('molecule'+index)  ? "collapse-arrow rotate-bottom-half" : "collapse-arrow up-half"} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                        <g transform="translate(884.477 -762) rotate(90)">
                                            <rect fill="none" width="16" height="16" transform="translate(762 868.477)" />
                                            <path fill="#343a40" d="M59.879,465.752l-3.694,3.694a.837.837,0,1,0,1.184,1.184l3.1-3.093,3.1,3.1a.84.84,0,0,0,1.432-.592.832.832,0,0,0-.248-.592l-3.7-3.7A.84.84,0,0,0,59.879,465.752Z" transform="translate(709.685 408.091)" />
                                        </g>
                                    </svg>
                                </span>
                            </p>
                            <div className="collapse-container">
                                <UncontrolledCollapse toggler={'#molecule' + index} toggleEvents={events}>
                                    <p className="mb-0 border-top p-2">{data[0][key]}</p>
                                </UncontrolledCollapse>
                            </div>
                        </section>
                    </React.Fragment>
                )
                }
            )}
        </React.Fragment>
    )
}
export default MoleculeInfo