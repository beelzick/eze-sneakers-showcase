import SneakerPage from '../../../src/components/SneakersPage/SneakersPage'
import Head from 'next/head'
import { womenPaths } from '../../../src/helpers/filterHelpers'
import { connectToDatabase } from '../../../lib/mongodb'

export default function MenFiltersPage({ name, sneakers, filter }) {
    return (
    <>
        <Head>
            <title>{`${name[0].toUpperCase()}${name.slice(1)} Collection - Women Restored Sneakers`}</title>
            <meta name='description' content={`Professionally restored sneakers from ${name[0].toUpperCase()}${name.slice(1)} Collection. Save our planet by buying restored shoes.`} />
        </Head>
        <SneakerPage
            sneakers={sneakers}
            title={`${name[0].toUpperCase()}${name.slice(1)} Collection for Women`}
            filterGroup='women'
            filter={filter}
        />
    </>
    )
}

export async function getStaticPaths() {
    return {
        paths: womenPaths,
        fallback: false,
    }
}

export async function getStaticProps({ params }) {
    const { filter } = params
    const { db } = await connectToDatabase()
    let name = filter
    let sneakersData

    switch (filter) {
        case 'most-rated':
            sneakersData = await db.collection('products').aggregate([
                {
                    $match:
                    {
                        rating: { $gte: 4.8 },
                        gender: 'woman'
                    },
                },
                { $limit: 18 }
            ]).toArray()
            name = 'Most Rated'
            break
        case 'new':
            sneakersData = await db.collection('products').aggregate([
                {
                    $match: {
                        addDate: { $gte: new Date(2019, 1) },
                        gender: 'woman'
                    }
                },
                { $sort: { addDate: -1 } },
                { $limit: 18 }
            ]).toArray()
            break
        case 'women-love':
            sneakersData = await db.collection('products').aggregate([
                {
                    $match: {
                        tags: 'women love',
                        gender: 'woman'
                    }
                }
            ]).toArray()
            name = 'Women Love'
            break
        case 'adidas':
        case 'nike':
        case 'puma':
            sneakersData = await db.collection('products').aggregate([
                {
                    $match: {
                        name: { $regex: `${filter[0].toUpperCase()}${filter.slice(1)}` },
                        gender: 'woman',
                    }
                },
                { $limit: 18 }
            ]).toArray()
            break
        default:
            sneakersData = await db.collection('products').aggregate([
                { $match: { tags: filter, gender: 'woman' } },
                { $limit: 18 }
            ]).toArray()
    }
    const sneakers = JSON.parse(JSON.stringify(sneakersData))
    return {
        props: {
            name,
            sneakers,
            filter
        }
    }
}