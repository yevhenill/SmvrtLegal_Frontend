export default function Projectprogress({ status }) {
    return (
        <div
            className='rounded-[4px] text-[#1CA38A] bg-[#ecf8f6] p-[5px] h-[33px] text-[15px] mt-[3px]'
            style={{ textTransform: 'uppercase' }}>
            {status}
        </div>
    );
}