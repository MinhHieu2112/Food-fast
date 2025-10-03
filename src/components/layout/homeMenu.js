import Image from "next/image"
import MenuItem from "@/components/menu/menuItem";
import SectionHeaders from "@/components/layout/sectionHeader";
export default function HomeMenu() {
    return (
        <section className="">
            <div className="absolute right-0 left-0 w-full justify-start" >
                <div className="absolute -top-[100px] right-0">
                    <Image src={'/right-salad.jpg'} width={110} height={202}
                     alt={'salad'} />
                </div>
                <div className="absolute left-0 -top-[70px] text-left -z-10">
                    <Image src={'/left-salad.jpg'} width={110} height={202} alt={'salad'} />
                </div>
            </div>
            <div className="text-center mb-4">
                <SectionHeaders 
                    subHeader={'check out'}
                    mainHeader={'Menu'} />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <MenuItem />
                <MenuItem />
                <MenuItem />
                <MenuItem />
                <MenuItem />
                <MenuItem />
            </div>
        </section>
    );
}