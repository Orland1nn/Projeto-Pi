"use client";

import React from "react";
import Header from "@/Components/Header";
import Pedido from "@/Components/Pedido";

export default function Pedidos() {
  return (
    <Header>
      <div className="h-full bg-white">
        <main className="flex flex-row h-full">
          <aside className="w-1/8 h-full border-r border-gray-300 cursor-pointer flex justify-center">
            <ul className=" text-rose-700 w-full font-bold">
              <li className=" hover:bg-rose-100  p-3">Todos Pedidos</li>
              <li className="hover:bg-rose-100  p-3 ">Maior Quantidade</li>
              <li className="hover:bg-rose-100  p-3 ">Menor Quantidade</li>
              <li className="hover:bg-rose-100 p-3 ">Maior preço</li>
              <li className="hover:bg-rose-100 p-3 ">Menor preço</li>
              <li className="hover:bg-rose-100  p-3 ">Data</li>
            </ul>
          </aside>

          <section className="flex flex-col flex-1 p-6">
            <header className="grid grid-cols-5 gap-4 mb-4 border-b border-gray-200 pb-2">
              <p className="text-base font-bold text-amber-700">Pedido</p>
              <p className="text-base font-bold text-amber-700">Itens</p>
              <p className="text-base font-bold text-amber-700">Preço Total</p>
              <p className="text-base font-bold text-amber-700">Data</p>
              <p className="text-base font-bold text-amber-700">Status</p>
            </header>

            <div className="flex flex-col">
              <Pedido></Pedido>
              <Pedido></Pedido>
            </div>
          </section>
        </main>
      </div>
    </Header>
  );
}
