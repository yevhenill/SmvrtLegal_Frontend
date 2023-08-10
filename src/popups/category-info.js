import Button from '@/components/button.js';
import WrapperModal from './wrapper.js'

export default function CategoryInfo(props) {
    return (<WrapperModal open={props.open} {...props} title="Category">
                <div className='text-[14px] text-[#171717] mb-[14px] mb-8'>
                   <strong className='underline underline-2'>Example: </strong> My Document, Business, Mysic, Sales, etc.
                </div>
            </WrapperModal>);
}