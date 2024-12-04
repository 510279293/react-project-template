import React, { Suspense } from "react"

const Lazy = ({path}: any) => {
    const RC = React.lazy(() => import(path))
    return (<Suspense fallback={<>loading</>}><RC /></Suspense>)
}

export default Lazy