import ImageGenerator from '@/components/ImageGenerator';

export default function Home() {
  return (
    <div 
      className="container mx-auto px-4 py-8" 
      style={{ backgroundImage: 'url(/images/background.png)', backgroundSize: 'cover', borderWidth: '1px', borderStyle: 'solid', borderColor: '#ccc' }}
    >
      <ImageGenerator />
    </div>
  );
}