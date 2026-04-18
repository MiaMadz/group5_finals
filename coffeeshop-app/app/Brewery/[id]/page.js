import ExplorePage from '../../Pages/ExplorePage'
 
export default async function BreweryPage({ params }) {
    const { id } = await params
    return <ExplorePage id={id} />
}