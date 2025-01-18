import SocialMediaIcons from './SocialMediaIcons';
import EmailIcon from '@mui/icons-material/Email';

export default function Footer() {
    const handleSubmit= () => {
        window.location.href = 'mailto:acinemaers@gmail.com?subject=Feedback&body=';
    };

    return (
        <div className="bg-[#151414] mt-7">
            <div className="grid mx-auto xs:grid-cols-2 lg:grid-cols-3 xs:w-[360px] sm:w-[390px] md:w-[750px] lg:w-[900px] xl:w-[1125px] p-5">
                <div className="lg:items-center sm:text-left md:text-left">
                    <h1 className="font-light xs:text-2xl md:text-4xl mb-0 ">CINEMAers</h1>
                    <p className="xs:text-[10px] sm:text-sm mt-0">Alright reserved © 2024</p>
                </div>
                <div className="text-left xs:row-span-2 lg:row-span-1">
                    <h2 className="font-light xs:text-[20px] sm:text-[18px] md:text-xl">ROYAL UNIVERSITY OF PHNOM PENH</h2>
                    <p className="xs:text-[10px] sm:text-[10px] md:text-[12px] my-2">CINEMAER@ABC.COM</p>
                    <p className="xs:text-[10px] sm:text-[10px] md:text-[12px] my-2">+855 12 345 6789</p>
                    <p className="xs:text-[10px] sm:text-[10px] md:text-[12px] my-2">Russian Federation Boulevard, Toul Kork, Phnom Penh, Cambodia.</p>
                </div>
                <div className="md:text-left text-center">
                    <div className="flex flex-col lg:items-end xs:text-left">
                        <div className="lg:text-left">
                        <h2 className="font-light xs:text-[15px] sm:text-[15px] md:text-xl sm:text-2xl">FOLLOW US ON SOCIAL</h2>
                        <SocialMediaIcons />
                        <div onClick={handleSubmit}>
                            <h2 className="font-light xs:text-[15px] sm:text-[15px] md:text-xl sm:text-2xl">GIVE US A FEEDBACK!</h2>
                            <EmailIcon sx={{ fontSize: 34 }} />
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}