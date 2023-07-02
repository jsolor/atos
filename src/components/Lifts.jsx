function Lifts() {

    return (
        <>
            <div className="overflow-x-auto">
                <table className="table table-sm table-pin-rows table-pin-cols">
                    <thead>
                        <tr>
                            <th></th> 
                            <td>Lift</td> 
                            <td>Weight</td> 
                            <td>Sets</td>
                            <td>Reps</td>
                            <td>Rep Out</td> 
                        </tr>
                    </thead> 
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>DeadLift</td> 
                            <td>280</td> 
                            <td>
                                <input type="checkbox" className="checkbox checkbox-sm checkbox-success" />
                                <input type="checkbox" className="checkbox checkbox-sm checkbox-success" />
                                <input type="checkbox" className="checkbox checkbox-sm checkbox-success" />
                                <input type="checkbox" className="checkbox checkbox-sm checkbox-success" />
                            </td>  
                            <td>4</td> 
                            <td>
                                <input type="text" placeholder="Type here" className="input input-bordered input-sm w-full max-w-xs" />
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Overhead Press</td> 
                            <td>100</td> 
                            <td>
                                <input type="checkbox" className="checkbox checkbox-sm checkbox-success" />
                                <input type="checkbox" className="checkbox checkbox-sm checkbox-success" />
                                <input type="checkbox" className="checkbox checkbox-sm checkbox-success" />
                                <input type="checkbox" className="checkbox checkbox-sm checkbox-success" />
                            </td> 
                            <td>4</td> 
                            <td>
                                <input type="text" placeholder="Type here" className="input input-bordered input-sm w-full max-w-xs" />
                            </td>
                        </tr>
                        <tr>
                            <td>3</td> 
                            <td>Pulldowns</td> 
                            <td>75</td> 
                            <td>
                                <input type="checkbox" className="checkbox checkbox-sm checkbox-success" />
                                <input type="checkbox" className="checkbox checkbox-sm checkbox-success" />
                                <input type="checkbox" className="checkbox checkbox-sm checkbox-success" />
                            </td> 
                            <td>8</td> 
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>
                                <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z"/>
                                    <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z"/>
                                </svg>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
}

export default Lifts;
