import Button from '@/components/button.js';
import WrapperModal from './wrapper.js'

export default function CategoryInfo(props) {
    return (<WrapperModal open={props.open} {...props} title="Category">
                <div className='text-[14px] text-[#171717] mb-[14px] mb-8'>
                    A <strong className='underline underline-2'>category</strong> is a parent group (like a folder) that allows you to sort and manage your documents based on specific needs. 
                </div>
            </WrapperModal>);
}