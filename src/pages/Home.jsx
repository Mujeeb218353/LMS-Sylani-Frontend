import Alert from "../components/Alert"
const Home = () => {
  return (
    <div className="min-h-screen px-2 py-20">
      <Alert />
      <div className="flex flex-nowrap overflow-x-scroll gap-2 " style={{"scrollbarWidth": "none"}}>
      <p className="badge  p-4 badge-accent">All</p>
      <p className="badge badge-ghost p-4">default</p>
      </div>
      Home Page
    </div>
  )
}

export default Home
