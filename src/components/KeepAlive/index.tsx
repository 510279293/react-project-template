import { Outlet, useLocation } from "react-router-dom";
import { KeepAliveRouteOutlet } from "keepalive-for-react";
import config from '@/project.config'
import { ReactNode, Suspense, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { StateType } from "@/store";
const { useCache } = config

function MemoScrollTopWrapper(props: { children?: ReactNode }) {
    const { children } = props;
    const domRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const {pathname, search} = location
    const scrollHistoryMap = useRef<Map<string, number>>(new Map());

    const activeKey = useMemo(() => (pathname + search), [pathname, search]);

    useEffect(() => {
        const divDom = domRef.current;
        if (!divDom) return;
        setTimeout(() => {
            divDom.scrollTo(0, scrollHistoryMap.current.get(activeKey) || 0);
        }, 300); 
        const onScroll = (e: Event) => {
            const target = e.target as HTMLDivElement;
            if (!target) return;
            scrollHistoryMap.current.set(activeKey, target?.scrollTop || 0);
        };
        divDom?.addEventListener("scroll", onScroll, {
            passive: true,
        });
        return () => {
            divDom?.removeEventListener("scroll", onScroll);
        };
    }, [activeKey]);

    return (
        <div
            className="animation-wrapper scrollbar w-full overflow-auto"
            // style={{
            //     height: "calc(100vh - 96px)",
            // }}
            ref={domRef}
        >
            {children}
        </div>
    );
}

function CustomSuspense(props: { children: ReactNode }) {
    const { children } = props;
    return <Suspense fallback={<>Loading...</>}>{children}</Suspense>;
}

function KeepAliveOutlet() {
    const cacheKey = useSelector((state: StateType) => state.cacheKey)  // 获取组织架构树
    const location = useLocation()
    const { pathname, search, hash } = location
    const fullPath = `${pathname}${search}${hash}`

    const KeepAliveRouteOutletMemo = useMemo(() => (
        <KeepAliveRouteOutlet
                wrapperComponent={MemoScrollTopWrapper}
                duration={300}
                transition={true}
                activeCacheKey={fullPath}
                include={cacheKey}
                // exclude={noCacheKey}
            />
        ), [cacheKey])
    
    return (<CustomSuspense>
               { useCache ? KeepAliveRouteOutletMemo : <Outlet /> }
            </CustomSuspense>)
}

export default KeepAliveOutlet
