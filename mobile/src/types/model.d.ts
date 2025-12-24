// data types


export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string | string[];
        statusCode: number | string;
        data?: T;
    }

    interface IRegister {
        _id: string;
    }

    interface IUserLogin {
        user: {
            email: string;
            _id: string;
            name: string;
            role: string;
            address: any;
            avatar: string;
            phone: string;
        }
        access_token: string;
    }

    export interface ReadingItem {
        id: number;
        title: string;
        author: string;
        progress: number;
        comments: number;
        days: number;
        avatars: string[];
    }

    export interface ConversationItem {
        id: number;
        items: number;
        members: number;
        avatars: string[];
    }
    interface ITopRestaurant {
        _id: string;
        name: string;
        phone: string;
        address: string;
        email: string;
        rating: number;
        image: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }
    interface IRestaurant {
        _id: string;
        name: string;
        phone: string;
        address: string;
        email: string;
        rating: number;
        image: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;

        menu: IMenu[];
    }
    interface IMenu {
        _id: string;
        restaurant: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        menuItem: IMenuItem[]
    }

    interface IMenuItem {
        _id: string;
        menu: string;
        title: string;
        description: string;
        basePrice: number,
        image: string;
        options: {
            title: string;
            description: string;
            additionalPrice: number;
        }[],
        createdAt: Date;
        updatedAt: Date;
    }
    interface ICart {
        [key: string]: {
            sum: number;
            quantity: number;
            items: {
                [key: string]: {
                    quantity: number;
                    data: IMenuItem;
                    extra?: {
                        [key: string]: number;
                    }
                };

            }
        }
    }
    interface IOrderHistory {
        _id: string;
        restaurant: IRestaurant;
        user: string;
        status: string;
        totalPrice: number;
        totalQuantity: number;
        orderTime: Date;
        detail: {
            image: string;
            title: string;
            option: string;
            price: number;
            quantity: number;
        }[]
        createdAt: Date;
        updatedAt: Date;
    }

}
