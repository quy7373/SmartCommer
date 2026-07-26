import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

export const HomePage = () => (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
            <section className="h-[500px] bg-[#F5F8F6] mb-20 flex flex-col items-center justify-center text-[#16211C] rounded-lg">
                <h1 className="text-6xl font-serif mb-6">Premium Collection</h1>
                <button className="bg-[#E8A33D] text-[#4A2F0A] px-8 py-3 rounded-[6px] hover:bg-[#DB9328] transition-colors font-medium">Shop Now</button>
            </section>

            <section className="mb-20">
                <h2 className="text-3xl font-serif text-[#16211C] mb-8">Categories</h2>
                <div className="grid grid-cols-4 gap-6">
                    {["Electronics", "Fashion", "Home Decor", "Accessories"].map((cat) => (
                        <div key={cat} className="aspect-square bg-white border border-[#DAD5C8] rounded-[8px] p-6 flex items-end hover:shadow-sm transition-shadow duration-150">
                            <h3 className="text-lg font-medium text-[#16211C]">{cat}</h3>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-20">
                <h2 className="text-3xl font-serif text-[#16211C] mb-8">Flash Sale</h2>
                <div className="grid grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white border border-[#DAD5C8] rounded-[8px] p-4 hover:shadow-lg transition-shadow duration-200">
                            <div className="h-48 bg-[#F5F5F2] rounded-[6px] mb-4"></div>
                            <h3 className="text-[#16211C] mb-2">Product Name {i}</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-[#16211C] font-mono">$99.00</span>
                                <span className="bg-[#E8A33D] text-[#4A2F0A] text-xs px-2 py-1 rounded-[999px]">Sale</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
        <Footer />
    </div>
);
