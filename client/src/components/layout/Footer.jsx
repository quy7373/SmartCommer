export const Footer = () => (
    <footer className="bg-[#FAF9F6] py-16 border-t border-[#E4DFD3]">
        <div className="container mx-auto px-4 grid grid-cols-5 gap-8 text-[#4A544D]">
            {["Company", "Support", "Policy", "Contact", "Social"].map((section) => (
                <div key={section}>
                    <h4 className="font-bold text-[#16211C] mb-4">{section}</h4>
                    <ul className="space-y-2 text-sm">
                        <li>Link 1</li>
                        <li>Link 2</li>
                    </ul>
                </div>
            ))}
        </div>
        <div className="text-center mt-12 text-[#8A8577] text-sm">Copyright © 2026 Smart Commerce</div>
    </footer>
);
